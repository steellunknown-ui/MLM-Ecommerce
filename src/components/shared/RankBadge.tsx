import { Badge } from '@/components/ui/badge'
import { Star, Shield, Crown, Diamond, Medal, Award, Target, TrendingUp, Users } from 'lucide-react'

interface RankBadgeProps {
  rank: string
  className?: string
}

const rankConfig: Record<string, { color: string; icon: React.ElementType }> = {
  'Distributor': { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: Users },
  'Sales Manager': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Target },
  'Team Manager': { color: 'bg-teal-500/20 text-teal-400 border-teal-500/30', icon: TrendingUp },
  'Silver': { color: 'bg-slate-400/20 text-slate-300 border-slate-400/30', icon: Medal },
  'Gold': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Award },
  'Platinum': { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Shield },
  'Emerald': { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Star },
  'Ruby': { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Star },
  'Pearl': { color: 'bg-pink-500/20 text-pink-400 border-pink-500/30', icon: Star },
  'Diamond': { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: Diamond },
  'Crown Diamond': { color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white border-transparent', icon: Crown },
}

export function RankBadge({ rank, className }: RankBadgeProps) {
  const config = rankConfig[rank] || rankConfig['Distributor']
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`flex items-center gap-1.5 px-2.5 py-1 ${config.color} ${className || ''}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="font-medium tracking-wide">{rank}</span>
    </Badge>
  )
}
