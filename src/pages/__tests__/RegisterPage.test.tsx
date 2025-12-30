import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RegisterPage from '../RegisterPage'
import { BrowserRouter } from 'react-router-dom'

// Mock the useAuthStore
vi.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    register: vi.fn(),
    loading: false,
    error: null
  })
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('RegisterPage', () => {
  it('renders registration form', () => {
    renderWithRouter(<RegisterPage />)
    
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders role selection', () => {
    renderWithRouter(<RegisterPage />)
    
    expect(screen.getByText('Account Type')).toBeInTheDocument()
    expect(screen.getByText('Individual')).toBeInTheDocument()
    expect(screen.getByText('Institution')).toBeInTheDocument()
  })

  it('renders create account button', () => {
    renderWithRouter(<RegisterPage />)
    
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders login link', () => {
    renderWithRouter(<RegisterPage />)
    
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
    expect(screen.getByText('Sign in here')).toBeInTheDocument()
  })

  it('allows user to select role', () => {
    renderWithRouter(<RegisterPage />)
    
    const individualButton = screen.getByText('Individual') as HTMLButtonElement
    const institutionButton = screen.getByText('Institution') as HTMLButtonElement
    
    expect(individualButton).toBeInTheDocument()
    expect(institutionButton).toBeInTheDocument()
    
    fireEvent.click(institutionButton)
    
    // Check if institution button is now selected (has primary styling)
    expect(institutionButton.className).toContain('border-primary-500')
  })

  it('allows user to type in form fields', () => {
    renderWithRouter(<RegisterPage />)
    
    const nameInput = screen.getByPlaceholderText('Enter your full name') as HTMLInputElement
    const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Enter your password') as HTMLInputElement
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password') as HTMLInputElement
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    
    expect(nameInput.value).toBe('John Doe')
    expect(emailInput.value).toBe('john@example.com')
    expect(passwordInput.value).toBe('password123')
    expect(confirmPasswordInput.value).toBe('password123')
  })

  it('shows password visibility toggle', () => {
    renderWithRouter(<RegisterPage />)
    
    const passwordToggle = screen.getAllByRole('button').find(button => 
      button.querySelector('.lucide-eye')
    )
    
    expect(passwordToggle).toBeInTheDocument()
  })
})