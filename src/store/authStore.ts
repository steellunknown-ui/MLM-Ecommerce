import { create } from 'zustand'
import { Database } from '../types/database.types'

type User = Database['public']['Tables']['users']['Row']

interface AuthState {
  user: User | null
  session: any | null
  setUser: (user: User | null) => void
  setSession: (session: any | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  logout: () => set({ user: null, session: null }),
}))
