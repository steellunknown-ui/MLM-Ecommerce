'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ShoppingBag, ShieldCheck, Truck, Award, ArrowRight, UserPlus, Star, ChevronRight, Plus, ArrowLeft, CheckCircle, Zap, Globe, TrendingUp, Users } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'

export default function HomePage() {
  const pathwayRef = useRef(null)
  const trustRef = useRef(null)

  // --- HERO BACKGROUND SLIDER LOGIC ---
  const HERO_SLIDES = [
    {
      image: "/hero/hero-1.png",
      badge: "India's Premier Direct Selling Platform",
      titleTop: "Build Your Legacy",
      titleBottom: "With",
      highlight: "Rohini Marketing",
      desc: "Discover premium everyday products, build a powerful network, and unlock unparalleled financial freedom through our proven 11-level ternary system."
    },
    {
      image: "/hero/hero-2.png",
      badge: "World-Class Quality Products",
      titleTop: "Premium Products",
      titleBottom: "For Everyday",
      highlight: "Wellness",
      desc: "From luxurious personal care to essential herbal supplements, our products are crafted with the highest quality standards to ensure exceptional results."
    },
    {
      image: "/hero/hero-3.png",
      badge: "Unmatched Earning Potential",
      titleTop: "Unlock True",
      titleBottom: "Financial",
      highlight: "Freedom",
      desc: "Our unique 11-Level Ternary Plan ensures that your hard work pays off. Earn joining bonuses and residual repurchase income down to 11 levels."
    },
    {
      image: "/hero/hero-4.png",
      badge: "Empowering Entrepreneurs",
      titleTop: "Be Your Own",
      titleBottom: "Boss",
      highlight: "Today",
      desc: "Join a community of driven individuals. We provide the mentorship, tools, and support you need to build a massive global business from anywhere."
    },
  ]
  const [heroIdx, setHeroIdx] = useState(0)
  const [isHeroHovered, setIsHeroHovered] = useState(false)

  const nextHeroSlide = () => setHeroIdx((prev) => (prev + 1) % HERO_SLIDES.length)
  const prevHeroSlide = () => setHeroIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)

  useEffect(() => {
    if (isHeroHovered) return
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [isHeroHovered])
  
  // --- TRUST MARKERS PARALLAX ---
  const { scrollYProgress: trustProgress } = useScroll({
    target: trustRef,
    offset: ["0 1", "0.7 0.7"] // triggers slightly earlier since it's high on the page
  })

  const trustXLeft = useTransform(trustProgress, [0, 1], [-150, 0])
  const trustYCenter = useTransform(trustProgress, [0, 1], [100, 0])
  const trustXRight = useTransform(trustProgress, [0, 1], [150, 0])
  const trustOpacity = useTransform(trustProgress, [0, 1], [0, 1])
  const trustScale = useTransform(trustProgress, [0, 1], [0.8, 1])

  // --- PATHWAY TO SUCCESS PARALLAX ---
  const { scrollYProgress: pathwayProgress } = useScroll({
    target: pathwayRef,
    offset: ["0 1", "0.6 0.6"]
  })

  const pathXLeft = useTransform(pathwayProgress, [0, 1], [-200, 0])
  const pathYCenter = useTransform(pathwayProgress, [0, 1], [150, 0])
  const pathXRight = useTransform(pathwayProgress, [0, 1], [200, 0])
  const pathOpacity = useTransform(pathwayProgress, [0, 1], [0, 1])
  const pathScale = useTransform(pathwayProgress, [0, 1], [0.8, 1])

  // --- BUSINESS PLAN PARALLAX ---
  const bizRef = useRef(null)
  const { scrollYProgress: bizProgress } = useScroll({
    target: bizRef,
    offset: ["0 1", "0.6 0.6"]
  })

  const bizXLeft = useTransform(bizProgress, [0, 1], [-200, 0])
  const bizXRight = useTransform(bizProgress, [0, 1], [200, 0])
  const bizOpacity = useTransform(bizProgress, [0, 1], [0, 1])
  const bizScale = useTransform(bizProgress, [0, 1], [0.8, 1])

  // --- WHY CHOOSE US PARALLAX ---
  const whyRef = useRef(null)
  const { scrollYProgress: whyProgress } = useScroll({
    target: whyRef,
    offset: ["0 1", "0.7 0.7"]
  })

  const whyXLeft = useTransform(whyProgress, [0, 1], [-200, 0])
  const whyYCenter = useTransform(whyProgress, [0, 1], [150, 0])
  const whyXRight = useTransform(whyProgress, [0, 1], [200, 0])
  const whyOpacity = useTransform(whyProgress, [0, 1], [0, 1])
  const whyScale = useTransform(whyProgress, [0, 1], [0.8, 1])

  // --- CAROUSEL LOGIC ---
  const DEMO_PRODUCTS = [
    { id: 1, name: "Herbal Radiance Face Wash", price: "₹299", bv: "10 BV", image: "/products/facewash.png", category: "Personal Care" },
    { id: 2, name: "Advanced Hair Growth Oil", price: "₹450", bv: "15 BV", image: "/products/hairoil.png", category: "Hair Care" },
    { id: 3, name: "Ayush Immunity Booster", price: "₹599", bv: "20 BV", image: "/products/immunity.png", category: "Wellness" },
    { id: 4, name: "Organic Glow Body Lotion", price: "₹349", bv: "12 BV", image: "/products/lotion.png", category: "Skin Care" },
    { id: 5, name: "Signature Luxury Perfume", price: "₹899", bv: "25 BV", image: "/products/perfume.png", category: "Fragrance" },
    { id: 6, name: "Premium Sanitary Pads", price: "₹199", bv: "5 BV", image: "/products/pads.png", category: "Feminine Care" },
    { id: 7, name: "Herbal Multivitamins", price: "₹499", bv: "18 BV", image: "/products/multivitamin.png", category: "Wellness" }
  ]

  // --- TOP EARNERS DATA ---
  const TOP_EARNERS = [
    {
      id: 1,
      name: "Rajesh Kumar",
      title: "Diamond Director",
      income: "₹12.5 Lakhs",
      image: "/earners/earner-1.png",
      quote: "Rohini Marketing completely transformed my financial future. Within 2 years, I achieved what I thought would take a lifetime.",
      delay: 0.2
    },
    {
      id: 2,
      name: "Priya Sharma",
      title: "Crown Executive",
      income: "₹8.2 Lakhs",
      image: "/earners/earner-2.png",
      quote: "The compensation plan is incredible. Not only have I built residual wealth, but I've empowered hundreds of women in my team.",
      delay: 0.4
    },
    {
      id: 3,
      name: "Arjun Patel",
      title: "Emerald Leader",
      income: "₹5.1 Lakhs",
      image: "/earners/earner-3.png",
      quote: "I started part-time and now this is my primary business. The high quality of the products makes selling truly effortless.",
      delay: 0.6
    },
    {
      id: 4,
      name: "Meera Reddy",
      title: "Platinum Director",
      income: "₹9.8 Lakhs",
      image: "/earners/earner-4.png",
      quote: "As a homemaker, I never imagined earning this much. The support system here is unparalleled, making success inevitable for anyone willing to try.",
      delay: 0.8
    },
    {
      id: 5,
      name: "Rohan Desai",
      title: "Ruby Executive",
      income: "₹4.6 Lakhs",
      image: "/earners/earner-5.png",
      quote: "The direct selling industry is full of noise, but Rohini Marketing stands out with genuine products and an incredibly ethical leadership team.",
      delay: 1.0
    },
    {
      id: 6,
      name: "Vikram Singh",
      title: "Global Ambassador",
      income: "₹18.4 Lakhs",
      image: "/earners/earner-6.png",
      quote: "Success here is not just about making money; it's about building a legacy. The 11-level ternary plan ensures your hard work pays off for generations.",
      delay: 1.2
    }
  ]

  // --- WHY CHOOSE US DATA ---
  const WHY_CHOOSE_US = [
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
      title: "100% Quality Guarantee",
      desc: "All our products are crafted with premium, organic ingredients to ensure maximum results and customer satisfaction."
    },
    {
      icon: <Zap className="w-8 h-8 text-emerald-500" />,
      title: "Weekly Fast Payouts",
      desc: "Get your hard-earned commissions directly in your bank account every single week. No waiting, no delays."
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-500" />,
      title: "Free Mentorship & Training",
      desc: "Access our exclusive academy where top leaders teach you step-by-step how to grow a massive global network."
    },
    {
      icon: <Truck className="w-8 h-8 text-emerald-500" />,
      title: "Nationwide Shipping",
      desc: "Focus on growing your network. We handle the logistics and deliver products straight to your customers' doors."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
      title: "Lucrative 11-Level Plan",
      desc: "Maximize your earning potential with our transparent, high-paying ternary compensation structure."
    },
    {
      icon: <Globe className="w-8 h-8 text-emerald-500" />,
      title: "Build a Global Business",
      desc: "Expand your team effortlessly across states and countries with our powerful digital tools and app."
    }
  ]

  return (
    <div className="flex flex-col w-full bg-background min-h-screen overflow-hidden">
      {/* 1. ENTERPRISE HERO SECTION */}
      <section 
        className="relative h-[92vh] border-b border-gray-800 overflow-hidden flex items-center group"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        {/* Navigation Buttons */}
        <button 
          onClick={prevHeroSlide}
          className="absolute left-2 md:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/30 hover:bg-primary border border-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button 
          onClick={nextHeroSlide}
          className="absolute right-2 md:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/30 hover:bg-primary border border-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Background Slider */}
        {HERO_SLIDES.map((slide, idx) => (
          <div 
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === heroIdx ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          >
            <Image src={slide.image} alt="Hero Background" fill className="object-cover" priority={idx === 0} />
            {/* Extremely transparent gradient just behind the text — image remains bright */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          </div>
        ))}

        <div className="container mx-auto px-4 relative z-10 grid items-center">
          <AnimatePresence>
            <motion.div
              key={heroIdx}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="col-start-1 row-start-1 space-y-8 max-w-3xl w-full"
            >

              <h1 className="text-5xl lg:text-7xl font-black leading-tight text-white tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                {HERO_SLIDES[heroIdx].titleTop} <br />
                {HERO_SLIDES[heroIdx].titleBottom} <span className="text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{HERO_SLIDES[heroIdx].highlight}</span>
              </h1>
              
              <p className="text-xl text-gray-100 max-w-2xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
                {HERO_SLIDES[heroIdx].desc}
              </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button className="w-full sm:w-auto h-14 px-8 text-lg hover:scale-105 transition-all shadow-xl shadow-primary/40 rounded-full font-bold bg-primary hover:bg-primary/90 text-white border-none">
                  <UserPlus className="w-5 h-5 mr-2" /> Start Your Business
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-white/40 text-white hover:bg-white/10 hover:border-white transition-all rounded-full font-bold backdrop-blur-sm bg-black/20">
                  <ShoppingBag className="w-5 h-5 mr-2" /> Shop Products
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 mt-8 border-t border-white/10">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-bold shadow-xl text-gray-300">
                    {['SK', 'RJ', 'AM', 'PK'][i-1]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 font-medium">
                Trusted by <strong className="text-white text-base">88,573+</strong> independent<br/>distributors nationwide.
              </p>
            </div>
          </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 2. TRUST MARKERS - CONVERGING PARALLAX SCROLL */}
      <section ref={trustRef} className="bg-gray-50 py-24 border-b border-gray-100 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            
            {/* Left Trust Marker */}
            <motion.div 
              style={{ x: trustXLeft, opacity: trustOpacity, scale: trustScale }} 
              className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100"
            >
              <ShieldCheck className="w-14 h-14 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure & Transparent</h3>
              <p className="text-gray-600 text-base">Govt. compliant direct selling model with automated payouts.</p>
            </motion.div>

            {/* Center Trust Marker */}
            <motion.div 
              style={{ y: trustYCenter, opacity: trustOpacity, scale: trustScale }} 
              className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100"
            >
              <Award className="w-14 h-14 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">100% Quality Guarantee</h3>
              <p className="text-gray-600 text-base">Premium products rigorously tested for safety and efficacy.</p>
            </motion.div>

            {/* Right Trust Marker */}
            <motion.div 
              style={{ x: trustXRight, opacity: trustOpacity, scale: trustScale }} 
              className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100"
            >
              <Truck className="w-14 h-14 text-primary mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Nationwide Delivery</h3>
              <p className="text-gray-600 text-base">Fast, reliable shipping directly to your doorstep across India.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* NEW: FEATURED PRODUCTS CAROUSEL */}
      <section className="py-24 bg-white overflow-hidden border-b border-gray-100">
        {/* Header row — inside container */}
        <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Selection</h2>
            <p className="text-gray-600 text-lg">High-quality products designed for your wellness and wealth.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/products">
              <Button variant="outline" className="rounded-full font-bold text-primary border-primary hover:bg-primary hover:text-white transition-all h-12 px-6">
                View All Products <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Marquee — INSIDE container, clips cleanly at edges */}
        <div className="container mx-auto px-4">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0%   { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .marquee-track {
              animation: marquee 40s linear infinite;
            }
            .marquee-track:hover {
              animation-play-state: paused;
            }
          `}} />
          <div className="overflow-hidden rounded-2xl">
            <div className="marquee-track flex gap-6 w-max pb-6 pt-2">
              {[...DEMO_PRODUCTS, ...DEMO_PRODUCTS].map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="w-[260px] lg:w-[230px] xl:w-[294px] 2xl:w-[358px] shrink-0 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group overflow-hidden cursor-pointer"
                >
                  <div className="relative w-full aspect-square bg-gray-50 p-6">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-gray-600 rounded-full shadow-sm">
                      {product.category}
                    </div>
                    <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-secondary font-bold text-sm bg-secondary/10 inline-block px-2 py-0.5 rounded-md mb-4">{product.bv}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-2xl font-black text-gray-900">{product.price}</span>
                      <Button className="rounded-full w-12 h-12 p-0 bg-gray-900 hover:bg-primary shadow-lg transition-colors">
                        <Plus className="w-5 h-5 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS - CONVERGING PARALLAX SCROLL */}
      <section ref={pathwayRef} className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Your Pathway to Success</h2>
            <p className="text-gray-600 text-xl">A simple, transparent, and highly rewarding business model designed for everyone.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative pb-10 z-10">
            {/* The horizontal connecting line */}
            <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-0.5 bg-gray-100 z-0" />

            {/* Left Card */}
            <motion.div 
              style={{ x: pathXLeft, opacity: pathOpacity, scale: pathScale }}
              className="relative z-10 bg-white p-10 rounded-3xl border border-gray-200 shadow-xl text-center"
            >
              <div className="w-20 h-20 mx-auto bg-primary text-white text-2xl font-black flex items-center justify-center rounded-2xl mb-8 shadow-lg shadow-primary/30">
                01
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Register & Shop</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Activate your ID with a nominal purchase of our premium products.</p>
            </motion.div>

            {/* Center Card */}
            <motion.div 
              style={{ y: pathYCenter, opacity: pathOpacity, scale: pathScale }}
              className="relative z-10 bg-white p-10 rounded-3xl border-2 border-primary/20 shadow-2xl text-center md:-translate-y-6"
            >
              <div className="w-20 h-20 mx-auto bg-secondary text-white text-2xl font-black flex items-center justify-center rounded-2xl mb-8 shadow-lg shadow-secondary/30">
                02
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Build Your Network</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Sponsor just 3 direct partners to unlock the powerful ternary matrix.</p>
            </motion.div>

            {/* Right Card */}
            <motion.div 
              style={{ x: pathXRight, opacity: pathOpacity, scale: pathScale }}
              className="relative z-10 bg-white p-10 rounded-3xl border border-gray-200 shadow-xl text-center"
            >
              <div className="w-20 h-20 mx-auto bg-primary text-white text-2xl font-black flex items-center justify-center rounded-2xl mb-8 shadow-lg shadow-primary/30">
                03
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Earn Residual Income</h3>
              <p className="text-gray-600 leading-relaxed text-lg">Receive joining and repurchase commissions down to 11 levels deep.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. BUSINESS PLAN HIGHLIGHT */}
      <section ref={bizRef} className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -z-0 opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              style={{ x: bizXLeft, opacity: bizOpacity, scale: bizScale }}
            >
              <h2 className="text-5xl font-bold mb-8 leading-tight">The Power of the <br/><span className="text-secondary">11-Level Ternary Plan</span></h2>
              <p className="text-gray-400 text-xl mb-10 leading-relaxed">
                Experience unparalleled earning potential. Our compensation plan is engineered for sustainable growth, rewarding both your direct efforts and team leadership.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="mt-1 bg-white/10 p-3 rounded-xl"><ShieldCheck className="text-primary w-8 h-8" /></div>
                  <div>
                    <h4 className="font-bold text-2xl mb-2">Instant Joining Income</h4>
                    <p className="text-gray-400 text-lg">Earn up to ₹50 per activation in your downline across 11 levels.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="mt-1 bg-white/10 p-3 rounded-xl"><ShieldCheck className="text-secondary w-8 h-8" /></div>
                  <div>
                    <h4 className="font-bold text-2xl mb-2">Monthly Repurchase Bonus</h4>
                    <p className="text-gray-400 text-lg">Secure long-term residual income with up to 10% on direct team sales.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Link href="/register">
                  <Button className="h-16 px-10 text-xl bg-secondary hover:bg-secondary/90 text-white rounded-full font-bold border-none shadow-xl shadow-secondary/20 hover:scale-105 transition-transform">
                    Become a Distributor <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              style={{ x: bizXRight, opacity: bizOpacity, scale: bizScale }}
            >
              <Card className="bg-white border-none shadow-2xl p-10 relative overflow-hidden text-gray-900 rounded-3xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Income Projection (Level 7)</h3>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-base text-gray-500 font-semibold">Active Network Growth</span>
                      <span className="text-base text-primary font-bold">70% to Target</span>
                    </div>
                    <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "70%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className="h-full bg-primary rounded-full" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
                      <p className="text-sm text-gray-500 font-bold mb-3 uppercase tracking-wider">Total Team</p>
                      <p className="text-4xl font-black text-gray-900">3,279</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center">
                      <p className="text-sm text-gray-500 font-bold mb-3 uppercase tracking-wider">Est. Monthly</p>
                      <p className="text-4xl font-black text-primary">₹17,717</p>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-center">
                    <p className="text-base text-gray-700 font-medium">Reach Level 11 to unlock <strong className="text-gray-900 font-bold text-xl block mt-2">₹2,65,720/month</strong></p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. TOP EARNERS / SOCIAL PROOF */}
      <section className="py-24 lg:py-32 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-gray-600 text-xl">Join thousands of individuals who are achieving financial freedom and rewriting their destinies with Rohini Marketing.</p>
          </motion.div>

          <div className="overflow-hidden rounded-2xl relative">
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes marquee-earners {
                0%   { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .marquee-track-earners {
                animation: marquee-earners 50s linear infinite;
              }
              .marquee-track-earners:hover {
                animation-play-state: paused;
              }
            `}} />
            <div className="marquee-track-earners flex gap-6 w-max pb-8 pt-4">
              {/* Duplicate array 2 times so it seamlessly loops - 50% translation */}
              {[...TOP_EARNERS, ...TOP_EARNERS].map((earner, idx) => (
                <div
                  key={`${earner.id}-${idx}`}
                  className="w-[260px] lg:w-[230px] xl:w-[294px] 2xl:w-[358px] shrink-0 snap-start bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow relative"
                >
                  {/* Quote Icon Background */}
                  <div className="absolute top-6 right-8 text-primary/10 font-serif text-8xl leading-none">"</div>
                  
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-20 h-20 xl:w-24 xl:h-24 shrink-0 rounded-full overflow-hidden border-4 border-gray-50 shadow-md">
                      <Image 
                        src={earner.image} 
                        alt={earner.name} 
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl xl:text-2xl text-gray-900 mb-1 line-clamp-1">{earner.name}</h3>
                      <p className="text-primary font-bold text-xs xl:text-sm bg-primary/10 inline-block px-3 py-1 rounded-full">{earner.title}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-base xl:text-lg italic leading-relaxed mb-8 relative z-10 line-clamp-4">
                    "{earner.quote}"
                  </p>

                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center absolute bottom-8 left-8 right-8">
                    <span className="text-gray-500 font-semibold uppercase tracking-wider text-xs xl:text-sm">Monthly</span>
                    <span className="text-xl xl:text-2xl font-black text-gray-900">{earner.income}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/success-stories">
              <Button variant="ghost" className="text-primary hover:bg-primary/5 font-bold text-lg h-14 px-8 rounded-full">
                View All Success Stories <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US (FEATURES GRID) */}
      <section ref={whyRef} className="pb-24 pt-4 bg-gray-50 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
              The Rohini Advantage
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Why Choose <span className="text-primary">Us?</span>
            </h2>
            <p className="text-xl text-gray-600">
              We provide the tools, products, and support system to guarantee your success in the direct selling industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {WHY_CHOOSE_US.map((feature, idx) => {
              const col = idx % 3;
              const xValue = col === 0 ? whyXLeft : col === 2 ? whyXRight : 0;
              const yValue = col === 1 ? whyYCenter : 0;

              return (
                <motion.div
                  key={idx}
                  style={{ x: xValue, y: yValue, opacity: whyOpacity, scale: whyScale }}
                  className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 7. ABOUT US SECTION */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-square lg:aspect-auto lg:h-[600px] shadow-2xl">
                <Image 
                  src="/hero/hero-2.png" 
                  alt="About Rohini Marketing" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 lg:p-12">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Our Promise</h3>
                  <p className="text-gray-200 text-lg drop-shadow-md">Delivering premium quality and unmatched financial freedom since 2010.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
                About Rohini Marketing
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                Empowering Dreams, <br />
                <span className="text-primary">Enriching Lives.</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We believe that everyone deserves the opportunity to build a life of financial independence and true freedom. Rohini Marketing was founded on the principle that premium products and a powerful network can change lives.
              </p>

              <div className="space-y-8 mb-10">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Star className="w-7 h-7 text-emerald-500 fill-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h4>
                    <p className="text-gray-600 leading-relaxed">To provide world-class, health-conscious products while creating India's most lucrative opportunity for everyday people.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Globe className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h4>
                    <p className="text-gray-600 leading-relaxed">To be the global benchmark in direct selling, admired for our ethics, transparency, and the massive success of our distributors.</p>
                  </div>
                </div>
              </div>

              <Link href="/about">
                <Button className="h-14 px-8 text-lg font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-all hover:scale-105 hover:shadow-xl">
                  Read Our Full Story <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. MASSIVE FINAL CTA */}
      <section className="relative py-32 bg-gray-900 overflow-hidden">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/20 blur-[120px] opacity-50 mix-blend-screen" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-emerald-600/20 blur-[100px] opacity-50 mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-2xl">
              Ready To <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">Change Your Life?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of successful distributors today. Start building your 11-level ternary network and take the first step towards total financial freedom.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/register">
                <Button className="w-full sm:w-auto h-16 px-10 text-xl font-black bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.6)] hover:scale-105 transition-all duration-300 border-none">
                  <UserPlus className="w-6 h-6 mr-3" /> Register Now For Free
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full sm:w-auto h-16 px-10 text-xl font-bold bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-full backdrop-blur-sm transition-all duration-300">
                  <ShoppingBag className="w-6 h-6 mr-3" /> Browse Products
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-500 mt-8 text-sm font-medium tracking-widest uppercase">
              No Hidden Fees • Instant Approval • Full Training Provided
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
