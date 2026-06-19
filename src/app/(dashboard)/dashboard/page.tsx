'use client'

import { useAuth } from '@/hooks/useAuth'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RankBadge } from '@/components/shared/RankBadge'
import { Users, DollarSign, ShoppingBag, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading dashboard...</div>
  if (!user) return null

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description={`Welcome back, ${user.full_name}`} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Current Rank</CardTitle>
            <RankBadge rank={user.rank} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{user.rank}</div>
            <p className="text-xs text-emerald-400 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" /> Active Status
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Network</CardTitle>
            <Users className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-gray-500 mt-1">Members in your downline</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Wallet Balance</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">₹0.00</div>
            <p className="text-xs text-gray-500 mt-1">Available to withdraw</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="bg-black/50 p-3 rounded-lg border border-white/10 flex-1 text-gray-300 font-mono text-sm truncate">
                https://rohinimarketing.com/register?ref={user.referral_code}
              </div>
              <Button onClick={() => navigator.clipboard.writeText(`https://rohinimarketing.com/register?ref=${user.referral_code}`)} className="bg-purple-600 hover:bg-purple-700 text-white">
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href="/products">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" /> Purchase Products
              </Button>
            </Link>
            <Link href="/my-network">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Users className="w-4 h-4 mr-2" /> View Tree
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
