'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, ArrowDownToLine, ArrowUpRight } from 'lucide-react'

export default function WalletPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="My Wallet" description="Manage your funds and request withdrawals." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-600/10 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">Available Balance</CardTitle>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹0.00</div>
            <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
              Withdraw Funds
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Earned</CardTitle>
            <ArrowDownToLine className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹0.00</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Withdrawn</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹0.00</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
