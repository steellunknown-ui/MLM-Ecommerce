import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rohini Marketing | छोटी खरीदारी बड़ी कमाई',
  description: 'India\'s premier direct selling platform offering quality products and unmatched earning opportunities.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0F0F0F] text-white min-h-screen flex flex-col`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
