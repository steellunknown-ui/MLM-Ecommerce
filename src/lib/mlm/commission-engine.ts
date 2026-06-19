import { createClient } from '../supabase/server'
import { Database } from '../../types/database.types'

type CommissionType = 'joining' | 'repurchase'

const JOINING_COMMISSIONS = [0, 50, 25, 15, 15, 10, 9, 9, 4, 3, 2]
const REPURCHASE_COMMISSION_RATES = [0.10, 0.08, 0.05, 0.03, 0.03, 0.0225, 0.0225, 0.0225, 0.0125, 0.0125, 0.0125]
const MIN_REPURCHASE_AMOUNT = 360

export async function distributeJoiningCommission(newUserId: string) {
  const supabase = createClient()
  
  // 1. Get the new user's network path to find uplines
  const { data: networkNode, error: networkError } = await supabase
    .from('mlm_network')
    .select('position_path, user_id')
    .eq('user_id', newUserId)
    .single()

  if (networkError || !networkNode?.position_path) {
    throw new Error('User network not found')
  }

  // position_path is like "uuid1/uuid2/uuid3", where uuid3 is parent
  const pathIds = networkNode.position_path.split('/').filter(id => id !== '')
  
  // Reverse to go from immediate parent up to 11 levels
  const uplines = pathIds.reverse().slice(0, 11)

  const commissionsToInsert = []
  
  for (let i = 0; i < uplines.length; i++) {
    const uplineId = uplines[i]
    const level = i + 1
    const amount = JOINING_COMMISSIONS[i] // Array is 0-indexed, so level 1 gets JOINING_COMMISSIONS[0] which is 0
    
    if (amount > 0) {
      commissionsToInsert.push({
        user_id: uplineId,
        from_user_id: newUserId,
        type: 'joining',
        level_earned: level,
        amount: amount,
        status: 'approved' // Automatically approved for joining
      })
    }
  }

  if (commissionsToInsert.length > 0) {
    // 2. Insert commissions
    const { error: insertError } = await supabase
      .from('commissions')
      .insert(commissionsToInsert)

    if (insertError) throw insertError

    // 3. Update wallets
    for (const comm of commissionsToInsert) {
      // Use RPC for atomic wallet update in real-world, here we'll do sequential for now
      // This is safe if we don't have high concurrency, but RPC is better
      const { data: wallet } = await supabase
        .from('wallet')
        .select('balance, total_earned')
        .eq('user_id', comm.user_id)
        .single()
        
      if (wallet) {
        await supabase
          .from('wallet')
          .update({
            balance: wallet.balance + comm.amount,
            total_earned: wallet.total_earned + comm.amount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', comm.user_id)
          
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: comm.user_id,
            type: 'credit',
            amount: comm.amount,
            description: `Joining commission from Level ${comm.level_earned}`
          })
      } else {
        // Create wallet if it doesn't exist
        await supabase
          .from('wallet')
          .insert({
            user_id: comm.user_id,
            balance: comm.amount,
            total_earned: comm.amount
          })
          
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: comm.user_id,
            type: 'credit',
            amount: comm.amount,
            description: `Joining commission from Level ${comm.level_earned}`
          })
      }
    }
  }
}

export async function distributeRepurchaseCommission(userId: string, orderId: string, orderAmount: number) {
  // If order is less than minimum repurchase, don't distribute? 
  // According to rules, repurchase income is paid ON ₹360 min purchase.
  if (orderAmount < MIN_REPURCHASE_AMOUNT) return;

  const supabase = createClient()
  
  const { data: networkNode } = await supabase
    .from('mlm_network')
    .select('position_path')
    .eq('user_id', userId)
    .single()

  if (!networkNode?.position_path) return;

  const pathIds = networkNode.position_path.split('/').filter(id => id !== '')
  const uplines = pathIds.reverse().slice(0, 11)

  const commissionsToInsert = []

  for (let i = 0; i < uplines.length; i++) {
    const uplineId = uplines[i]
    const level = i + 1
    // The repurchase income is a percentage of the purchase amount? 
    // Wait, the rules state "10% = ₹36" on a "₹360 minimum purchase". So it's 10% of order amount.
    const rate = REPURCHASE_COMMISSION_RATES[i]
    const amount = Number((orderAmount * rate).toFixed(2))

    if (amount > 0) {
      commissionsToInsert.push({
        user_id: uplineId,
        from_user_id: userId,
        type: 'repurchase',
        level_earned: level,
        amount: amount,
        order_id: orderId,
        status: 'approved'
      })
    }
  }

  if (commissionsToInsert.length > 0) {
    await supabase.from('commissions').insert(commissionsToInsert)

    // Update wallets
    for (const comm of commissionsToInsert) {
      const { data: wallet } = await supabase
        .from('wallet')
        .select('balance, total_earned')
        .eq('user_id', comm.user_id)
        .single()
        
      if (wallet) {
        await supabase
          .from('wallet')
          .update({
            balance: wallet.balance + comm.amount,
            total_earned: wallet.total_earned + comm.amount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', comm.user_id)
          
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: comm.user_id,
            type: 'credit',
            amount: comm.amount,
            description: `Repurchase commission from Level ${comm.level_earned}`
          })
      }
    }
  }
}
