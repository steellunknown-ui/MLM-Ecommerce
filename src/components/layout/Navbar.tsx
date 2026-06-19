'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ShoppingCart, User, Menu, X, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export function Navbar() {
  const { totalItems } = useCart()
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
            RM
          </div>
          <span className="font-bold text-xl hidden sm:block tracking-tight text-gray-900">
            Rohini<span className="text-primary">Marketing</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">Home</Link>
          <Link href="/products" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">Shop</Link>
          <Link href="/business-plan" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">Business Plan</Link>
          <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">About Us</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-gray-900 w-48 focus:w-64 placeholder:text-gray-400"
            />
          </div>

          <Link href="/cart" className="relative p-2 text-gray-500 hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-4 h-4 bg-secondary rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          {user ? (
            <Link href="/dashboard">
              <Button className="hidden sm:flex bg-gray-100 hover:bg-gray-200 text-gray-900 border-none rounded-full h-9 font-semibold">
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="hidden sm:flex bg-primary hover:bg-primary/90 text-white transition-all shadow-sm shadow-primary/20 border-none rounded-full h-9 font-semibold">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}

          <button 
            className="md:hidden p-2 text-gray-500 hover:text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 shadow-xl"
        >
          <div className="flex flex-col space-y-3">
            <Link href="/" className="text-base font-semibold text-gray-600 hover:text-primary">Home</Link>
            <Link href="/products" className="text-base font-semibold text-gray-600 hover:text-primary">Shop</Link>
            <Link href="/business-plan" className="text-base font-semibold text-gray-600 hover:text-primary">Business Plan</Link>
            <Link href="/about" className="text-base font-semibold text-gray-600 hover:text-primary">About Us</Link>
            <hr className="border-gray-100" />
            {user ? (
              <Link href="/dashboard" className="text-base font-semibold text-primary">Dashboard</Link>
            ) : (
              <Link href="/login" className="text-base font-semibold text-primary">Login / Register</Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}
