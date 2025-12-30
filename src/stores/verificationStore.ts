import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface VerificationRequest {
  id: string
  requester_id: string
  user_id: string
  identity_id: string
  status: 'pending' | 'approved' | 'rejected'
  verification_type: string
  message?: string
  result_data?: any
  created_at: string
  responded_at?: string
}

interface VerificationState {
  requests: VerificationRequest[]
  loading: boolean
  error: string | null
  isLoadingRequests: boolean
  createRequest: (data: Partial<VerificationRequest>) => Promise<void>
  getRequests: (userId: string) => Promise<void>
  updateRequest: (id: string, status: 'approved' | 'rejected') => Promise<void>
}

export const useVerificationStore = create<VerificationState>((set, get) => ({
  requests: [],
  loading: false,
  error: null,
  isLoadingRequests: false,

  createRequest: async (data) => {
    set({ loading: true, error: null })
    try {
      const { data: request, error } = await supabase
        .from('verification_requests')
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      
      set(state => ({ 
        requests: [...state.requests, request], 
        loading: false 
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  getRequests: async (userId) => {
    if (get().isLoadingRequests) return
    
    set({ loading: true, error: null, isLoadingRequests: true })
    try {
      const { data: requests, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      set({ requests: requests || [], loading: false, isLoadingRequests: false })
    } catch (error: any) {
      set({ error: error.message, loading: false, isLoadingRequests: false })
    }
  },

  updateRequest: async (id, status) => {
    set({ loading: true, error: null })
    try {
      const { data: request, error } = await supabase
        .from('verification_requests')
        .update({ 
          status, 
          responded_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      set(state => ({
        requests: state.requests.map(r => r.id === id ? request : r),
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))