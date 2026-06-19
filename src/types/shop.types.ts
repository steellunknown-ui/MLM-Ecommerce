import { Database } from './database.types'

export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

export interface CartState {
  items: { product: Product; quantity: number }[]
  totalAmount: number
  totalBv: number
}
