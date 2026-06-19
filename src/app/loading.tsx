export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute inset-0 border-4 border-t-purple-600 border-r-amber-500 border-b-emerald-500 border-l-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-amber-500 border-r-emerald-500 border-b-purple-600 border-l-amber-500 rounded-full animate-spin-slow"></div>
        <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-amber-500 text-sm">
          RM
        </div>
      </div>
    </div>
  )
}
