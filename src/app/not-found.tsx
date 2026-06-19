import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-amber-500 to-emerald-500">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-gray-400">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 transition-transform">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
