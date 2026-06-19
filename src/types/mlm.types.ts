export interface NetworkNode {
  id: string
  userId: string
  parentId: string | null
  sponsorId: string | null
  level: number
  totalDownline: number
  directReferrals: number
  rank: string
  fullName: string
  is_active: boolean
  avatar_url?: string | null
}

export interface MlmStats {
  totalTeam: number
  totalDirect: number
  currentRank: string
  nextRank: string
  totalEarned: number
  walletBalance: number
}

export interface CommissionTransaction {
  id: string
  amount: number
  type: string
  level_earned: number
  created_at: string
  status: string
  from_user: {
    full_name: string
    rank: string
  }
}
