import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { items, totalAmount, totalBv, paymentId } = body

    // 1. Create Order
    const orderNumber = 'RM-' + Math.floor(100000 + Math.random() * 900000)
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        status: 'completed', // Assuming payment succeeded
        total_amount: totalAmount,
        total_bv: totalBv,
        payment_id: paymentId,
        payment_status: 'paid'
      })
      .select()
      .single()

    if (orderError || !order) {
      throw new Error('Failed to create order')
    }

    // 2. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      bv: item.product.bv
    }))

    await supabase.from('order_items').insert(orderItems)

    // 3. Mark user as active if this is their first purchase >= 360
    const { data: userData } = await supabase
      .from('users')
      .select('is_active')
      .eq('id', user.id)
      .single()

    if (userData && !userData.is_active && totalAmount >= 360) {
      await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', user.id)
        
      // Distribute Joining Commission
      // We would call the commission engine here
      // distributeJoiningCommission(user.id)
    } else if (totalAmount >= 360) {
      // Distribute Repurchase Commission
      // distributeRepurchaseCommission(user.id, order.id, totalAmount)
    }

    return NextResponse.json({ success: true, orderId: order.id })

  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
