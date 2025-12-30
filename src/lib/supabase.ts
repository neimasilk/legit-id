import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

function createStubClient() {
  const stubAuth = {
    signInWithPassword: async (_args: any) => ({ data: { user: null, session: null }, error: null }),
    signUp: async (_args: any) => ({ data: { user: null, session: null }, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  }
  const stubFrom = (_table: string) => ({
    select: () => ({ eq: (_col: string, _val: any) => ({ single: async () => ({ data: null, error: null }) }) }),
    insert: async (_rows: any[]) => ({ data: null, error: null }),
  })
  return { auth: stubAuth, from: stubFrom } as any
}

const isTestEnv = typeof import.meta !== 'undefined' && (import.meta as any).vitest

export const supabase = isTestEnv
  ? createClient('http://localhost', 'test-key')
  : (supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createStubClient())
