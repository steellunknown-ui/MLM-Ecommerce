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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, CheckCircle2, UserPlus } from 'lucide-react'

// Schemas for the 3 steps
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

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sponsorName, setSponsorName] = useState<string | null>(null)

  // Forms for each step
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

  // Auto-verify referral code if it exists in URL
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      verifyReferralCode(ref)
    }
  }, [searchParams])

  const verifyReferralCode = async (code: string) => {
    if (!code) return false

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
    setIsLoading(true)
    const isValid = await verifyReferralCode(data.referralCode)
    setIsLoading(false)
    
    if (isValid) {
      setStep(3)
    }
  }

  const onStep3Submit = async (data: z.infer<typeof step3Schema>) => {
    setIsLoading(true)
    
    try {
      // 1. We would ideally call our API route here to handle the transaction securely
      // For Phase 1, we simulate an API call to our own endpoint
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
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      <div className="absolute bottom-0 -left-40 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-purple-500/20">
            RM
          </div>
          <span className="font-bold text-3xl tracking-tight text-white">
            Rohini<span className="text-purple-400">Marketing</span>
          </span>
        </Link>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="w-full bg-black/40 h-1.5 flex">
            <div className={`h-full bg-gradient-to-r from-purple-600 to-amber-500 transition-all duration-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
          </div>

          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              {step === 1 && 'Create Account'}
              {step === 2 && 'Referral Details'}
              {step === 3 && 'Complete Profile'}
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Step {step} of 3
            </CardDescription>
          </CardHeader>

          <CardContent className="min-h-[300px]">
            <AnimatePresence mode="wait">
              
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Form {...form1}>
                    <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4">
                      <FormField control={form1.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Full Name</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} className="bg-black/20 border-white/10 text-white" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form1.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email Address</FormLabel>
                          <FormControl><Input type="email" placeholder="john@example.com" {...field} className="bg-black/20 border-white/10 text-white" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form1.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Phone Number</FormLabel>
                          <FormControl><Input placeholder="9876543210" {...field} className="bg-black/20 border-white/10 text-white" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form1.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
                          <FormControl><Input type="password" placeholder="••••••••" {...field} className="bg-black/20 border-white/10 text-white" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white mt-6">
                        Continue <ArrowRight className="ml-2 w-4 h-4" />
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
                          <FormLabel className="text-gray-300">Sponsor Referral Code</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="Enter code" {...field} className="bg-black/20 border-white/10 text-white uppercase" />
                              <Button type="button" variant="secondary" onClick={() => verifyReferralCode(field.value)} className="bg-white/10 text-white hover:bg-white/20">
                                Verify
                              </Button>
                            </div>
                          </FormControl>
                          {sponsorName && <p className="text-sm text-emerald-400 mt-2 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Sponsor: {sponsorName}</p>}
                          <FormMessage />
                        </FormItem>
                      )}/>
                      
                      <div className="flex gap-4 mt-8">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full border-white/10 text-white hover:bg-white/5">
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                          Continue <ArrowRight className="ml-2 w-4 h-4" />
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
                          <FormLabel className="text-gray-300">Complete Address</FormLabel>
                          <FormControl><Input placeholder="Street, landmark" {...field} className="bg-black/20 border-white/10 text-white" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form3.control} name="city" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">City</FormLabel>
                            <FormControl><Input placeholder="City" {...field} className="bg-black/20 border-white/10 text-white" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form3.control} name="state" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">State</FormLabel>
                            <FormControl><Input placeholder="State" {...field} className="bg-black/20 border-white/10 text-white" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                      <FormField control={form3.control} name="pincode" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Pincode</FormLabel>
                          <FormControl><Input placeholder="123456" {...field} className="bg-black/20 border-white/10 text-white" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      
                      <div className="flex gap-4 mt-8">
                        <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full border-white/10 text-white hover:bg-white/5">
                          <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                          {isLoading ? 'Creating Account...' : (
                            <><UserPlus className="mr-2 w-4 h-4" /> Complete Registration</>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              )}

            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/10 pt-6 bg-black/20">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
