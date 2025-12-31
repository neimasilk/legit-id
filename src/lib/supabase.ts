import { createClient } from '@supabase/supabase-js'

// Mock implementation for development/testing without real backend
// This allows the app to function in a "demo" mode when env vars are missing

const mockUser = {
  id: 'mock-user-id-' + Date.now(),
  email: 'test@example.com',
  user_metadata: { fullName: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
}

// In-memory storage for mock identities
// We use a global array so it persists across different calls to supabase.from()
const mockIdentities: any[] = [];

const createMockClient = () => {
  console.log('Using Mock Supabase Client');
  
  return {
    auth: {
      signInWithPassword: async ({ email, password: _password }: any) => {
        console.log('Mock SignIn', email);
        mockUser.email = email;
        return { data: { user: { ...mockUser, email }, session: { access_token: 'mock-token' } }, error: null }
      },
      signUp: async ({ email, password: _password, options }: any) => {
        console.log('Mock SignUp', email);
        return { 
          data: { 
            user: { ...mockUser, email, user_metadata: options?.data }, 
            session: { access_token: 'mock-token' } 
          }, 
          error: null 
        }
      },
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: mockUser }, error: null }),
      getSession: async () => ({ data: { session: { access_token: 'mock-token', user: mockUser } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => {
      const queryBuilder: any = {
        _filters: {} as Record<string, any>,
        _data: null as any,
        
        select: (_columns?: string) => queryBuilder,
        
        insert: (data: any) => {
            console.log(`Mock Insert into ${table}:`, data);
            if (table === 'identities') {
                const newIdentity = { 
                    ...data[0], 
                    id: 'mock-identity-id-' + Date.now(),
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                mockIdentities.push(newIdentity);
                queryBuilder._data = newIdentity;
            }
            return queryBuilder;
        },
        
        update: (data: any) => {
            console.log(`Mock Update ${table}:`, data);
            return queryBuilder;
        },
        
        eq: (column: string, value: any) => {
            queryBuilder._filters[column] = value;
            return queryBuilder;
        },
        
        single: async () => {
            if (table === 'users') {
                const role = mockUser.email?.includes('admin') ? 'admin' : 'individual';
                return { 
                  data: { 
                    ...mockUser, 
                    role, 
                    is_verified: false,
                    full_name: mockUser.user_metadata?.fullName || 'Test User'
                  }, 
                  error: null 
                }
            }
            
            if (table === 'identities') {
                // If we just inserted data, return it
                if (queryBuilder._data) {
                    return { data: queryBuilder._data, error: null };
                }
                
                // Otherwise check filters (e.g. user_id)
                const userId = queryBuilder._filters['user_id'];
                if (userId) {
                    // Since the test user ID is dynamic (from signUp mock), we need to match carefully.
                    // But wait, the mock auth returns a STATIC mockUser ID: 'mock-user-id-' + timestamp
                    // But that timestamp is fixed when file loads.
                    // The TEST script generates a random user name, but the ID comes from here.
                    // The App uses the ID returned by auth.
                    
                    // Actually, the auth mock returns `mockUser`.
                    // And `mockIdentities` stores `user_id` from the insert data.
                    // The insert data comes from `createIdentity` which uses `user.id`.
                    // So they should match.
                    
                    const match = mockIdentities.find(i => i.user_id === userId);
                    if (match) {
                        return { data: match, error: null };
                    }
                }
                
                // If not found, return error so the store sets identity to null
                return { data: null, error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' } };
            }
            
            return { data: mockUser, error: null }
        },
        
        maybeSingle: async () => {
             if (table === 'users') {
                return { data: { ...mockUser, role: 'individual', is_verified: false }, error: null }
            }
            return { data: null, error: null }
        }
      };
      return queryBuilder;
    }
  } as any;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Use real client if env vars exist, otherwise mock
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createMockClient()
