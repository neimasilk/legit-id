import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email: string
  full_name: string
  role: 'individual' | 'institution' | 'admin'
  is_verified: boolean
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, fullName: string, role: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (userData) {
          set({ user: userData as User, loading: false, isAuthenticated: true })
        } else {
          // Fallback if user profile doesn't exist
          set({ 
            user: { 
              id: data.user.id, 
              email: data.user.email!, 
              full_name: data.user.user_metadata?.fullName || data.user.email!.split('@')[0],
              role: 'individual',
              is_verified: false
            }, 
            loading: false, 
            isAuthenticated: true 
          })
        }
        return true
      }
      return false
    } catch (error: any) {
      set({ error: error.message, loading: false, isAuthenticated: false })
      return false
    }
  },

  register: async (email: string, password: string, fullName: string, role: string) => {
    set({ loading: true, error: null })
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { fullName, role }
        }
      })
      
      if (authError) throw authError
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              full_name: fullName,
              role,
              is_verified: false,
            },
          ])
        
        if (profileError) throw profileError
        
        set({ 
          user: {
            id: authData.user.id,
            email,
            full_name: fullName,
            role: role as 'individual' | 'institution' | 'admin',
            is_verified: false,
          },
          loading: false,
          isAuthenticated: true
        })
        return true
      }
      return false
    } catch (error: any) {
      set({ error: error.message, loading: false, isAuthenticated: false })
      return false
    }
  },

  logout: async () => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, loading: false, isAuthenticated: false })
    } catch (error: any) {
      set({ error: error.message, loading: false, isAuthenticated: false })
    }
  },

  checkAuth: async () => {
    set({ loading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (userData) {
          set({ user: userData as User, loading: false, isAuthenticated: true })
        } else {
           set({ 
            user: { 
              id: user.id, 
              email: user.email!, 
              full_name: user.user_metadata?.fullName || user.email!.split('@')[0],
              role: 'individual',
              is_verified: false
            }, 
            loading: false, 
            isAuthenticated: true 
          })
        }
      } else {
        set({ user: null, loading: false, isAuthenticated: false })
      }
    } catch (error) {
      set({ user: null, loading: false, isAuthenticated: false })
    }
  },

  setError: (message: string) => set({ error: message }),
  clearError: () => set({ error: null }),
}))
