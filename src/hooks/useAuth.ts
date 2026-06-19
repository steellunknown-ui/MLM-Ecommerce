'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase/client'
import { useAuthStore } from '../store/authStore'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const supabase = createClient()
  const router = useRouter()
  const { user, session, setUser, setSession, logout } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        setUser(userData)
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      
      if (event === 'SIGNED_IN' && session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        setUser(userData)
      } else if (event === 'SIGNED_OUT') {
        logout()
        router.push('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, setUser, setSession, logout, router])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, session, loading, signOut }
}
