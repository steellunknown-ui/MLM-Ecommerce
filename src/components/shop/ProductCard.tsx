'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Product } from '@/types/shop.types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.name} added to cart`, {
      style: {
        background: '#18181b',
        color: '#fff',
        border: '1px solid rgba(124, 58, 237, 0.2)'
      },
      iconTheme: {
        primary: '#7C3AED',
        secondary: '#fff',
      },
    })
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:border-purple-500/30 transition-colors flex flex-col group">
        <div className="relative aspect-square overflow-hidden bg-white/5 p-4 flex items-center justify-center">
          <Badge className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold border-none">
            {product.bv} BV
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-2">
            <Button size="icon" variant="secondary" className="rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border-none">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="icon" onClick={handleAddToCart} className="rounded-full bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 border-none shadow-lg shadow-purple-500/25">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-lg">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <p className="text-xs text-purple-400 mb-1">{product.category}</p>
          <h3 className="font-semibold text-white truncate text-lg group-hover:text-purple-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-2xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
