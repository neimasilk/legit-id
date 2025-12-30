import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface Identity {
  id: string
  user_id: string
  full_name: string
  date_of_birth: string
  id_number: string
  status: 'pending' | 'verified' | 'rejected' | 'expired'
  blockchain_hash?: string
  document_urls?: string[]
  verified_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

interface IdentityState {
  identity: Identity | null
  loading: boolean
  error: string | null
  createIdentity: (data: Partial<Identity>) => Promise<boolean>
  getIdentity: (userId: string) => Promise<void>
  updateIdentity: (id: string, data: Partial<Identity>) => Promise<void>
}

export const useIdentityStore = create<IdentityState>((set) => ({
  identity: null,
  loading: false,
  error: null,

  createIdentity: async (data) => {
    set({ loading: true, error: null })
    try {
      const { data: identity, error } = await supabase
        .from('identities')
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      
      set({ identity, loading: false })
      return true
    } catch (error: any) {
      set({ error: error.message, loading: false })
      return false
    }
  },

  getIdentity: async (userId) => {
    set({ loading: true, error: null })
    try {
      const { data: identity, error } = await supabase
        .from('identities')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      
      set({ identity: identity || null, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  updateIdentity: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const { data: identity, error } = await supabase
        .from('identities')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      set({ identity, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))