import { createClient } from '../supabase/server'

// Rank mapping based on levels
// This is a simplified logic. Real MLM companies usually tie ranks to total downline, leg volumes, etc.
// The prompt states:
// Level 1 = Distributor
// Level 2 = Sales Manager
// Level 3 = Team Manager
// Level 4 = Silver
// ...
// We will assign rank based on `level_in_network` or `total_downline`. 
// Assuming it's based on how deep they have successfully built their own tree or simply direct referrals/team size.
// Let's implement a team-size based rank advancement.

const RANKS = [
  { name: 'Distributor', minTeam: 0 },
  { name: 'Sales Manager', minTeam: 3 },       // Level 1 complete (3)
  { name: 'Team Manager', minTeam: 12 },       // Level 2 complete (3+9)
  { name: 'Silver', minTeam: 39 },             // Level 3 complete (3+9+27)
  { name: 'Gold', minTeam: 120 },              // Level 4 complete (39+81)
  { name: 'Platinum', minTeam: 363 },          // Level 5
  { name: 'Emerald', minTeam: 1092 },          // Level 6
  { name: 'Ruby', minTeam: 3279 },             // Level 7
  { name: 'Pearl', minTeam: 9840 },            // Level 8
  { name: 'Diamond', minTeam: 29523 },         // Level 9
  { name: 'Crown Diamond', minTeam: 88572 }    // Level 10
]

export async function checkAndUpgradeRank(userId: string) {
  const supabase = createClient()
  
  const { data: network } = await supabase
    .from('mlm_network')
    .select('total_downline')
    .eq('user_id', userId)
    .single()
    
  if (!network) return
  
  const teamSize = network.total_downline
  
  // Find highest rank they qualify for
  let newRank = 'Distributor'
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (teamSize >= RANKS[i].minTeam) {
      newRank = RANKS[i].name
      break
    }
  }
  
  const { data: user } = await supabase
    .from('users')
    .select('rank')
    .eq('id', userId)
    .single()
    
  if (user && user.rank !== newRank) {
    // Rank up!
    await supabase
      .from('users')
      .update({ rank: newRank })
      .eq('id', userId)
      
    // Ideally create a notification or history record here
  }
}
