'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
          Something went wrong!
        </h2>
        <p className="text-gray-400">
          An unexpected error occurred. Please try again later or contact support if the issue persists.
        </p>
        <Button
          onClick={() => reset()}
          className="bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 transition-transform"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}
