'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'
import { useAuth } from './useAuth'

export function useNetwork() {
  const supabase = createClient()
  const { user } = useAuth()
  const [networkStats, setNetworkStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchNetwork = async () => {
      try {
        const { data, error } = await supabase
          .from('mlm_network')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setNetworkStats(data)
      } catch (err) {
        console.error('Error fetching network:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNetwork()
  }, [user, supabase])

  return { networkStats, loading }
}
