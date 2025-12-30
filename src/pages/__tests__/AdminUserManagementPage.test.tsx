import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminUserManagementPage from '../AdminUserManagementPage'
import { BrowserRouter } from 'react-router-dom'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AdminUserManagementPage', () => {
  it('renders user management header', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('Manage all users in the system')).toBeInTheDocument()
  })

  it('renders search and filter controls', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
    expect(screen.getByText('All Roles')).toBeInTheDocument()
    expect(screen.getByText('All Status')).toBeInTheDocument()
    expect(screen.getByText('All Verification')).toBeInTheDocument()
  })

  it('renders users table headers', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Verification')).toBeInTheDocument()
    expect(screen.getByText('Created')).toBeInTheDocument()
    expect(screen.getByText('Last Login')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('renders sample users', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument()
    expect(screen.getByText(/TechCorp Solutions/)).toBeInTheDocument()
    expect(screen.getByText('bob.johnson@example.com')).toBeInTheDocument()
    expect(screen.getByText('Sarah Wilson')).toBeInTheDocument()
    expect(screen.getByText('FinanceHub Ltd')).toBeInTheDocument()
  })

  it('renders role badges correctly', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    expect(screen.getAllByText('Individual').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Institution').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0)
  })

  it('renders status badges correctly', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Inactive').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Suspended').length).toBeGreaterThan(0)
  })

  it('renders verification badges correctly', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    expect(screen.getAllByText('Verified').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Not Submitted').length).toBeGreaterThan(0)
  })

  it('renders action buttons for each user', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    const viewButtons = screen.getAllByLabelText('View user details')
    const editButtons = screen.getAllByLabelText('Edit user')
    const deleteButtons = screen.getAllByLabelText('Delete user')
    
    expect(viewButtons.length).toBeGreaterThan(0)
    expect(editButtons.length).toBeGreaterThan(0)
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('renders bulk actions section', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    expect(screen.getByText('Bulk Actions:')).toBeInTheDocument()
    expect(screen.getByText('Activate Selected')).toBeInTheDocument()
    expect(screen.getByText('Suspend Selected')).toBeInTheDocument()
  })

  it('allows searching users', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    const searchInput = screen.getByPlaceholderText('Search users...') as HTMLInputElement
    
    fireEvent.change(searchInput, { target: { value: 'John' } })
    
    expect(searchInput.value).toBe('John')
  })

  it('allows filtering by role', () => {
    renderWithRouter(<AdminUserManagementPage />)
    
    const roleSelect = screen.getByText('All Roles').closest('select') as HTMLSelectElement
    
    fireEvent.change(roleSelect, { target: { value: 'individual' } })
    
    expect(roleSelect.value).toBe('individual')
  })
})