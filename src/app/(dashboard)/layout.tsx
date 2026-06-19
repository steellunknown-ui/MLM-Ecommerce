export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* For Phase 1, we will keep it simple with a top nav or just let it use the root layout if needed.
          Actually, let's add a basic sidebar or just return children if we want to build a custom dashboard shell. */}
      <div className="flex">
        {/* Sidebar placeholder */}
        <aside className="w-64 border-r border-white/10 hidden md:block min-h-screen p-6">
          <div className="text-2xl font-bold text-white mb-8">RM Dashboard</div>
          <nav className="space-y-4 text-gray-400">
            <a href="/dashboard" className="block hover:text-white">Overview</a>
            <a href="/my-network" className="block hover:text-white">My Network</a>
            <a href="/earnings" className="block hover:text-white">Earnings</a>
            <a href="/wallet" className="block hover:text-white">Wallet</a>
            <a href="/orders" className="block hover:text-white">Orders</a>
          </nav>
        </aside>
        <main className="flex-1 p-6 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  )
}
