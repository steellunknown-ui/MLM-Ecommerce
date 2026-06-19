'use client'

import { useNetwork } from '@/hooks/useNetwork'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Network, Users, ArrowDownToLine } from 'lucide-react'

export default function MyNetworkPage() {
  const { networkStats, loading } = useNetwork()

  if (loading) return <div>Loading network...</div>

  return (
    <div className="space-y-8">
      <PageHeader title="My Network Tree" description="View your downline and team structure across 11 levels." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Downline</CardTitle>
            <Users className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{networkStats?.total_downline || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Direct Referrals</CardTitle>
            <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{networkStats?.direct_referrals || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Network Level</CardTitle>
            <Network className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{networkStats?.level_in_network || 1}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Genealogy Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[300px] border border-white/5 rounded-lg bg-black/20">
            <p className="text-gray-500 text-sm">
              Tree visualization will be implemented here. For Phase 1, we show your high-level stats.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
