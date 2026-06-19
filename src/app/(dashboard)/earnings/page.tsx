'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function EarningsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Earnings History" description="Track your joining commissions and repurchase income." />

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Recent Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Level</TableHead>
                <TableHead className="text-gray-400">From User</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Empty state for Phase 1 */}
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No earnings recorded yet. Start referring to earn!
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
