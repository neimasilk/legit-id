import { describe, it, expect, beforeEach, vi } from 'vitest';

// Hoist the mock object so it's available before imports
const mockSupabase = vi.hoisted(() => ({
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn()
      }))
    }))
  }))
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase
}));

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase
}));

import { useAuthStore } from '../authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set loading state during login', async () => {
    const { login } = useAuthStore.getState();
    
    mockSupabase.auth.signInWithPassword.mockImplementation(async () => {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 10));
        return {
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null
        };
    });
    
    // Mock user profile fetch
    const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
                data: { 
                    id: '123', 
                    email: 'test@example.com',
                    full_name: 'Test User',
                    role: 'individual',
                    is_verified: false
                },
                error: null
            })
        })
    });
    mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

    const loginPromise = login('test@example.com', 'password');
    
    expect(useAuthStore.getState().loading).toBe(true);
    
    await loginPromise;
    
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('should handle successful login', async () => {
    const { login } = useAuthStore.getState();
    const mockUser = { 
        id: '123', 
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'individual',
        is_verified: false
    };
    
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null
    });

    // Mock user profile fetch
    const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
                data: mockUser,
                error: null
            })
        })
    });
    mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

    await login('test@example.com', 'password');
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle login error', async () => {
    const { login } = useAuthStore.getState();
    const mockError = { message: 'Invalid credentials' };
    
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: mockError
    });

    await login('test@example.com', 'wrongpassword');
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe('Invalid credentials');
  });

  it('should handle successful registration', async () => {
    const { register } = useAuthStore.getState();
    const mockUser = { 
        id: '456', 
        email: 'newuser@example.com',
        full_name: 'New User',
        role: 'individual',
        is_verified: false
    };
    
    mockSupabase.auth.signUp.mockResolvedValueOnce({
      data: { user: { id: '456', email: 'newuser@example.com' } },
      error: null
    });

    // Mock profile creation
    const mockInsert = vi.fn().mockResolvedValue({
        error: null
    });
    mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

    await register('newuser@example.com', 'password', 'New User', 'individual');
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle logout', async () => {
    const { logout } = useAuthStore.getState();
    
    // First set a user
    useAuthStore.setState({
      user: { id: '123', email: 'test@example.com', full_name: 'Test', role: 'individual', is_verified: false },
      isAuthenticated: true
    });

    mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null });

    await logout();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
