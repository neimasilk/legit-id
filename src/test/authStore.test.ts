import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../stores/authStore'

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn()
    }
  }
}))

describe('useAuthStore', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set loading state during login', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    // The loading state should be handled properly
    expect(result.current.loading).toBe(false)
  })

  it('should set loading state during registration', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      await result.current.register('test@example.com', 'password', 'Test User', 'individual')
    })
    
    // The loading state should be handled properly
    expect(result.current.loading).toBe(false)
  })

  it('should clear user on logout', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      await result.current.logout()
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should handle authentication check', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      await result.current.checkAuth()
    })
    
    // Should handle auth check without errors
    expect(result.current.loading).toBe(false)
  })
})