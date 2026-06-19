export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          referral_code: string
          referred_by: string | null
          sponsor_id: string | null
          level: number
          rank: string
          is_active: boolean
          is_admin: boolean
          joining_date: string
          kyc_status: string
          pan_number: string | null
          bank_account: string | null
          bank_ifsc: string | null
          bank_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone: string
          referral_code: string
          referred_by?: string | null
          sponsor_id?: string | null
          level?: number
          rank?: string
          is_active?: boolean
          is_admin?: boolean
          joining_date?: string
          kyc_status?: string
          pan_number?: string | null
          bank_account?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          referral_code?: string
          referred_by?: string | null
          sponsor_id?: string | null
          level?: number
          rank?: string
          is_active?: boolean
          is_admin?: boolean
          joining_date?: string
          kyc_status?: string
          pan_number?: string | null
          bank_account?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mlm_network: {
        Row: {
          id: string
          user_id: string
          parent_id: string | null
          sponsor_id: string | null
          level_in_network: number
          position_path: string | null
          total_downline: number
          direct_referrals: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          parent_id?: string | null
          sponsor_id?: string | null
          level_in_network?: number
          position_path?: string | null
          total_downline?: number
          direct_referrals?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          parent_id?: string | null
          sponsor_id?: string | null
          level_in_network?: number
          position_path?: string | null
          total_downline?: number
          direct_referrals?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          bv: number
          category: string
          image_url: string | null
          stock: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          bv: number
          category: string
          image_url?: string | null
          stock?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          bv?: number
          category?: string
          image_url?: string | null
          stock?: number
          is_active?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          status: string
          total_amount: number
          total_bv: number
          payment_id: string | null
          payment_status: string
          shipping_address: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id: string
          status?: string
          total_amount: number
          total_bv: number
          payment_id?: string | null
          payment_status?: string
          shipping_address?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          status?: string
          total_amount?: number
          total_bv?: number
          payment_id?: string | null
          payment_status?: string
          shipping_address?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          bv: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          bv: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          bv?: number
        }
      }
      commissions: {
        Row: {
          id: string
          user_id: string
          from_user_id: string
          type: string
          level_earned: number
          amount: number
          order_id: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          from_user_id: string
          type: string
          level_earned: number
          amount: number
          order_id?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          from_user_id?: string
          type?: string
          level_earned?: number
          amount?: number
          order_id?: string | null
          status?: string
          created_at?: string
        }
      }
      wallet: {
        Row: {
          id: string
          user_id: string
          balance: number
          total_earned: number
          total_withdrawn: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
        }
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          description: string | null
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
      }
      withdrawals: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: string
          bank_details: Json | null
          admin_note: string | null
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status?: string
          bank_details?: Json | null
          admin_note?: string | null
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: string
          bank_details?: Json | null
          admin_note?: string | null
          created_at?: string
          processed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
