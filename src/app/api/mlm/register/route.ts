import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { findNextAvailablePosition, updateUplineCounts } from '@/lib/mlm/network-builder'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fullName, email, phone, password, referralCode, address, city, state, pincode } = body

    const supabase = createClient()

    // 1. Find sponsor by referralCode
    let sponsorId = null
    if (referralCode) {
      const { data: sponsor } = await supabase
        .from('users')
        .select('id')
        .eq('referral_code', referralCode)
        .single()
      
      if (sponsor) {
        sponsorId = sponsor.id
      } else {
        return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
      }
    }

    // 2. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    const userId = authData.user.id
    
    // Generate unique referral code for new user
    const newReferralCode = fullName.substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000)

    // 3. Insert into Users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        full_name: fullName,
        email: email,
        phone: phone,
        referral_code: newReferralCode,
        referred_by: sponsorId,
        sponsor_id: sponsorId,
        is_active: false, // Active only after first purchase
      })

    if (userError) {
      // In real-world, we'd delete the auth user here to rollback
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }

    // 4. Handle Network Placement (Ternary Unilevel)
    if (sponsorId) {
      try {
        const { parentId, path } = await findNextAvailablePosition(sponsorId)
        
        const pathArray = path.split('/').filter(p => p !== '')
        const levelInNetwork = pathArray.length + 1

        await supabase
          .from('mlm_network')
          .insert({
            user_id: userId,
            parent_id: parentId,
            sponsor_id: sponsorId,
            level_in_network: levelInNetwork,
            position_path: path
          })

        // Update direct referrals count for sponsor
        const { data: sponsorNetwork } = await supabase
          .from('mlm_network')
          .select('direct_referrals')
          .eq('user_id', sponsorId)
          .single()

        if (sponsorNetwork) {
          await supabase
            .from('mlm_network')
            .update({ direct_referrals: sponsorNetwork.direct_referrals + 1 })
            .eq('user_id', sponsorId)
        }

        // Update downline counts for all uplines
        await updateUplineCounts(userId, path)

      } catch (networkError: any) {
        console.error('Network placement failed:', networkError)
        // Continuing anyway since user is created, but they might be unplaced. 
        // Real system needs proper transaction.
      }
    } else {
      // Top level node
      await supabase
        .from('mlm_network')
        .insert({
          user_id: userId,
          parent_id: null,
          sponsor_id: null,
          level_in_network: 1,
          position_path: ''
        })
    }

    // 5. Create Wallet
    await supabase
      .from('wallet')
      .insert({
        user_id: userId,
        balance: 0,
        total_earned: 0,
        total_withdrawn: 0
      })

    return NextResponse.json({ success: true, userId, message: 'Registration successful' })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
