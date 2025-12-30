import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminDashboardPage from '../AdminDashboardPage'
import { BrowserRouter } from 'react-router-dom'

// Mock the useAuthStore
vi.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: 'admin123',
      email: 'admin@example.com',
      fullName: 'Admin User'
    }
  })
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AdminDashboardPage', () => {
  it('renders admin dashboard header', () => {
    renderWithRouter(<AdminDashboardPage />)
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Welcome back, Admin User')).toBeInTheDocument()
  })

  it('renders statistics cards', () => {
    renderWithRouter(<AdminDashboardPage />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    // Using getAllByText because some numbers might appear multiple times or within fragments
    expect(screen.getAllByText('1.247')[0]).toBeInTheDocument()
    expect(screen.getByText('Verified Users')).toBeInTheDocument()
    expect(screen.getAllByText('856')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Pending')[0]).toBeInTheDocument()
    expect(screen.getAllByText('23')[0]).toBeInTheDocument()
    expect(screen.getByText('Rejected')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('Total Verifications')).toBeInTheDocument()
    expect(screen.getByText('924')).toBeInTheDocument()
    expect(screen.getByText('Success Rate')).toBeInTheDocument()
    expect(screen.getByText('92.6%')).toBeInTheDocument()
  })

  it('renders recent activities section', () => {
    renderWithRouter(<AdminDashboardPage />)
    
    expect(screen.getByText('Recent Activities')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getAllByText('Identity verification submitted')[0]).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Identity verification approved')).toBeInTheDocument()
  })

  it('renders quick actions section', () => {
    renderWithRouter(<AdminDashboardPage />)
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    expect(screen.getByText('Manage Users')).toBeInTheDocument()
    expect(screen.getByText('Review Requests')).toBeInTheDocument()
    expect(screen.getByText('System Alerts')).toBeInTheDocument()
    expect(screen.getByText('View Reports')).toBeInTheDocument()
  })

  it('renders status badges correctly', () => {
    renderWithRouter(<AdminDashboardPage />)
    
    expect(screen.getAllByText('pending')[0]).toBeInTheDocument()
    expect(screen.getAllByText('success')[0]).toBeInTheDocument()
    expect(screen.getAllByText('rejected')[0]).toBeInTheDocument()
  })

  it('renders view all activities button', () => {
    renderWithRouter(<AdminDashboardPage />)
    
    expect(screen.getByRole('button', { name: /view all activities/i })).toBeInTheDocument()
  })
})