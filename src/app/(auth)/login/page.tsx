'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LogIn, TrendingUp, ArrowLeft, ArrowRight, CheckCircle2, UserPlus, Eye, EyeOff } from 'lucide-react'

// --- SCHEMAS ---
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

const step1Schema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const step2Schema = z.object({
  referralCode: z.string().min(3, 'Referral code is required'),
})

const step3Schema = z.object({
  address: z.string().min(10, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Invalid pincode'),
})

export default function AuthPortal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  // -- OVERALL STATE --
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [direction, setDirection] = useState(0) // 1 = slide left (to register), -1 = slide right (to login)

  // -- LOGIN STATE --
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // -- REGISTER STATE --
  const [step, setStep] = useState(1)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const [sponsorName, setSponsorName] = useState<string | null>(null)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)

  // -- SLIDER STATE --
  const [bgIndex, setBgIndex] = useState(0)
  const bgImages = ['/login/login-1.png', '/login/login-2.png', '/login/login-3.png']

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [bgImages.length])

  // -- FORMS --
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const form1 = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: { fullName: '', email: '', phone: '', password: '' },
  })

  const form2 = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: { referralCode: searchParams.get('ref') || '' },
  })

  const form3 = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: { address: '', city: '', state: '', pincode: '' },
  })

  // -- LOGIN LOGIC --
  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoginLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast.error(error.message)
      setIsLoginLoading(false)
      return
    }

    toast.success('Login successful!')
    router.push('/dashboard')
    router.refresh()
  }

  async function signInWithGoogle() {
    setIsGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    
    if (error) {
      toast.error(error.message)
      setIsGoogleLoading(false)
    }
  }

  // -- REGISTER LOGIC --
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setAuthMode('register')
      verifyReferralCode(ref)
    }
  }, [searchParams])

  const verifyReferralCode = async (code: string) => {
    if (!code) return false

    // --- DEMO OVERRIDE FOR TESTING UI ---
    if (code.toUpperCase() === 'ROHINI100') {
      setSponsorName('Rohini Admin (Demo)')
      form2.clearErrors('referralCode')
      return true
    }
    if (code.toUpperCase() === 'VIP2024') {
      setSponsorName('Priya Sharma (Top Earner Demo)')
      form2.clearErrors('referralCode')
      return true
    }
    // ------------------------------------

    const { data, error } = await supabase
      .from('users')
      .select('full_name')
      .eq('referral_code', code)
      .single()

    if (error || !data) {
      form2.setError('referralCode', { message: 'Invalid or inactive referral code' })
      setSponsorName(null)
      return false
    }

    setSponsorName(data.full_name)
    form2.clearErrors('referralCode')
    return true
  }

  const onStep1Submit = (data: z.infer<typeof step1Schema>) => {
    setStep(2)
  }

  const onStep2Submit = async (data: z.infer<typeof step2Schema>) => {
    setIsRegisterLoading(true)
    const isValid = await verifyReferralCode(data.referralCode)
    setIsRegisterLoading(false)
    if (isValid) setStep(3)
  }

  const onStep3Submit = async (data: z.infer<typeof step3Schema>) => {
    setIsRegisterLoading(true)
    try {
      const response = await fetch('/api/mlm/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form1.getValues(),
          ...form2.getValues(),
          ...data
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      toast.success('Registration successful! Welcome to RM.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsRegisterLoading(false)
    }
  }

  // -- TOGGLE LOGIC --
  const toggleAuthMode = () => {
    if (authMode === 'login') {
      setDirection(1)
      setAuthMode('register')
    } else {
      setDirection(-1)
      setAuthMode('login')
    }
  }

  // -- ANIMATION VARIANTS --
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 800 : -800,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 800 : -800,
      opacity: 0,
    }),
  }

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden relative">
      
      {/* LEFT SIDE - INTERACTIVE FORMS */}
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-start lg:justify-center p-8 sm:p-12 lg:p-24 relative overflow-y-auto scrollbar-hide">
        
        {/* Back Button */}
        <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-gray-900 transition-colors flex items-center font-semibold z-20">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
        </Link>

        {/* Sliding Container */}
        <div className="w-full max-w-md relative pt-24 lg:pt-0 my-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">

            
            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <motion.div
                key="login"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/30">RM</div>
                  <span className="font-black text-3xl tracking-tight text-gray-900">Rohini<span className="text-primary">Marketing</span></span>
                </div>

                <div className="mb-8">
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome back</h1>
                  <p className="text-lg text-gray-500">Sign in to your account to continue building your empire.</p>
                </div>

                <div className="space-y-6">
                  <Button type="button" variant="outline" onClick={signInWithGoogle} disabled={isGoogleLoading || isLoginLoading} className="w-full h-14 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-bold text-lg rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md">
                    {isGoogleLoading ? 'Connecting to Google...' : (
                      <>
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span></div>
                  </div>

                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                      <FormField control={loginForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-bold">Email Address</FormLabel>
                          <FormControl><Input placeholder="name@example.com" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary focus:ring-primary rounded-xl transition-all" /></FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )} />
                      <FormField control={loginForm.control} name="password" render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-gray-700 font-bold">Password</FormLabel>
                            <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary focus:ring-primary rounded-xl transition-all pr-12" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )} />
                      <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all hover:scale-[1.02] mt-6" disabled={isLoginLoading || isGoogleLoading}>
                        {isLoginLoading ? 'Signing in...' : <><LogIn className="w-5 h-5 mr-2" /> Sign In</>}
                      </Button>
                    </form>
                  </Form>

                  <p className="text-center text-gray-500 mt-10">
                    Don't have an account?{' '}
                    <button onClick={toggleAuthMode} className="text-primary hover:text-primary/80 font-bold transition-colors">
                      Join as a Distributor
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* REGISTER FORM */}
            {authMode === 'register' && (
              <motion.div
                key="register"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/30">RM</div>
                  <span className="font-black text-3xl tracking-tight text-gray-900">Rohini<span className="text-primary">Marketing</span></span>
                </div>

                <div className="mb-8">
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                    {step === 1 && 'Create Account'}
                    {step === 2 && 'Referral Details'}
                    {step === 3 && 'Complete Profile'}
                  </h1>
                  <p className="text-lg text-gray-500">Step {step} of 3</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div className={`h-full bg-primary transition-all duration-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* STEP 1 */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <Form {...form1}>
                        <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4">
                          <FormField control={form1.control} name="fullName" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-bold">Full Name</FormLabel>
                              <FormControl><Input placeholder="John Doe" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary rounded-xl" /></FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}/>
                          <FormField control={form1.control} name="email" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-bold">Email Address</FormLabel>
                              <FormControl><Input type="email" placeholder="john@example.com" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary rounded-xl" /></FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}/>
                          <FormField control={form1.control} name="phone" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-bold">Phone Number</FormLabel>
                              <FormControl><Input placeholder="9876543210" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary rounded-xl" /></FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}/>
                          <FormField control={form1.control} name="password" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-bold">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input type={showRegisterPassword ? "text" : "password"} placeholder="••••••••" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary rounded-xl pr-12" />
                                  <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}/>
                          <Button type="submit" className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg rounded-xl transition-all hover:scale-[1.02] mt-6">
                            Continue <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                        </form>
                      </Form>
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <Form {...form2}>
                        <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4">
                          <FormField control={form2.control} name="referralCode" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-bold">Sponsor Referral Code</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input placeholder="Enter code" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary rounded-xl uppercase" />
                                  <Button type="button" variant="secondary" onClick={() => verifyReferralCode(field.value)} className="h-14 bg-gray-200 text-gray-900 hover:bg-gray-300 font-bold rounded-xl px-6">
                                    Verify
                                  </Button>
                                </div>
                              </FormControl>
                              {sponsorName && <p className="text-sm text-primary font-bold mt-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Sponsor: {sponsorName}</p>}
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}/>
                          
                          <div className="grid grid-cols-2 gap-4 mt-8">
                            <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full h-14 border-gray-200 text-gray-700 font-bold rounded-xl">
                              <ArrowLeft className="mr-2 w-5 h-5" /> Back
                            </Button>
                            <Button type="submit" disabled={isRegisterLoading} className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl">
                              Continue <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <Form {...form3}>
                        <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-4">
                          <FormField control={form3.control} name="address" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-bold">Complete Address</FormLabel>
                              <FormControl><Input placeholder="Street, landmark" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary rounded-xl" /></FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}/>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={form3.control} name="city" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-bold">City</FormLabel>
                                <FormControl><Input placeholder="City" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary rounded-xl" /></FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}/>
                            <FormField control={form3.control} name="state" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 font-bold">State</FormLabel>
                                <FormControl><Input placeholder="State" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary rounded-xl" /></FormControl>
                                <FormMessage className="text-red-500" />
                              </FormItem>
                            )}/>
                          </div>
                          <FormField control={form3.control} name="pincode" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-bold">Pincode</FormLabel>
                              <FormControl><Input placeholder="123456" {...field} className="h-14 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-primary rounded-xl" /></FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}/>
                          
                          <div className="grid grid-cols-2 gap-4 mt-8">
                            <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full h-14 border-gray-200 text-gray-700 font-bold rounded-xl">
                              <ArrowLeft className="mr-2 w-5 h-5" /> Back
                            </Button>
                            <Button type="submit" disabled={isRegisterLoading} className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all hover:scale-[1.02]">
                              {isRegisterLoading ? 'Registering...' : <><UserPlus className="mr-2 w-5 h-5" /> Complete</>}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-center text-gray-500 mt-10 pb-8">
                  Already have an account?{' '}
                  <button onClick={toggleAuthMode} className="text-primary hover:text-primary/80 font-bold transition-colors">
                    Back to Login
                  </button>
                </p>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE - BRAND SHOWCASE (Remains Static during Sliding) */}
      <div className="hidden lg:flex w-1/2 h-full bg-gray-900 relative overflow-hidden flex-col justify-center items-center p-12 lg:p-24 shadow-[inset_20px_0_40px_rgba(0,0,0,0.5)] z-30">
        
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={bgIndex}
              src={bgImages[bgIndex]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
          </AnimatePresence>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-screen filter blur-[120px] opacity-70 animate-pulse-slow z-0"></div>
        <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-70 z-0"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">
              Build Your Legacy with <br /><span className="text-emerald-400">Rohini Marketing</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Access your distributor dashboard to track your network growth, view real-time commission payouts, and manage your premium product inventory.
            </p>
          </motion.div>

          {/* Floating Social Proof Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.5 },
              scale: { duration: 0.6, delay: 0.5 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl flex items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-300 font-bold uppercase tracking-wider mb-1">Live Update</p>
              <p className="text-2xl font-black text-white">Level 5 Achieved! 🎉</p>
              <p className="text-emerald-400 font-semibold mt-1">Est. Monthly Income: ₹45,000</p>
            </div>
          </motion.div>

          {/* Secondary Floating Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.7 },
              x: { duration: 0.6, delay: 0.7 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
            className="absolute -right-10 bottom-20 bg-gray-900/80 backdrop-blur-md border border-gray-700 p-5 rounded-2xl shadow-xl flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
              <img src="/earners/earner-3.png" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Priya Sharma</p>
              <p className="text-gray-400 text-xs">Joined 2 days ago</p>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  )
}
