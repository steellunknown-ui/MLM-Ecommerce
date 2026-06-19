import { cn } from '@/lib/utils'

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('relative flex items-center justify-center w-8 h-8', className)}>
      <div className="absolute inset-0 border-2 border-t-purple-600 border-r-amber-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
    </div>
  )
}
