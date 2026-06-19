import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-white text-lg">
                RM
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Rohini<span className="text-primary">Marketing</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-secondary">
              "छोटी खरीदारी बड़ी कमाई"
            </p>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              India's premier direct selling platform offering quality products and unmatched earning opportunities through our innovative 11-level ternary plan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-sm text-gray-400 hover:text-primary transition-colors">Shop Products</Link></li>
              <li><Link href="/business-plan" className="text-sm text-gray-400 hover:text-primary transition-colors">Business Plan</Link></li>
              <li><Link href="/login" className="text-sm text-gray-400 hover:text-primary transition-colors">Distributor Login</Link></li>
              <li><Link href="/register" className="text-sm text-gray-400 hover:text-primary transition-colors">Join as Distributor</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/products?category=Personal Care" className="text-sm text-gray-400 hover:text-primary transition-colors">Personal Care</Link></li>
              <li><Link href="/products?category=Hair Care" className="text-sm text-gray-400 hover:text-primary transition-colors">Hair Care</Link></li>
              <li><Link href="/products?category=Skin Care" className="text-sm text-gray-400 hover:text-primary transition-colors">Skin Care</Link></li>
              <li><Link href="/products?category=Body Care" className="text-sm text-gray-400 hover:text-primary transition-colors">Body Care</Link></li>
              <li><Link href="/products?category=Feminine Care" className="text-sm text-gray-400 hover:text-primary transition-colors">Feminine Care</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Near ITI Collage NH-19<br />Madhosingh Aurai<br />Bhadohi 221301</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@rohinimarketing.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Rohini Marketing. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
