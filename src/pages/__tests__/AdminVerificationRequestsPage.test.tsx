import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminVerificationRequestsPage from '../AdminVerificationRequestsPage'
import { BrowserRouter } from 'react-router-dom'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AdminVerificationRequestsPage', () => {
  it('renders verification requests header', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    expect(screen.getByText('Verification Requests')).toBeInTheDocument()
    expect(screen.getByText('Review and manage identity verification requests')).toBeInTheDocument()
  })

  it('renders statistics cards', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    expect(screen.getByText('Total Requests')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getAllByText('Approved').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0)
    // There are multiple '1's, so we can't just getByText('1') if it's unique
    // But since we are asserting existence, it's fine if multiple exist.
  })

  it('renders search and filter controls', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    expect(screen.getByPlaceholderText('Search requests...')).toBeInTheDocument()
    expect(screen.getByText('All Status')).toBeInTheDocument()
    expect(screen.getByText('All Types')).toBeInTheDocument()
  })

  it('renders requests table headers', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Submitted')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('renders sample verification requests', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText(/TechCorp Solutions/)).toBeInTheDocument()
    expect(screen.getByText('admin@techcorp.com')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('renders request type badges correctly', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    const individualBadges = screen.getAllByText('Individual')
    expect(individualBadges.length).toBeGreaterThan(0)
    
    const institutionBadges = screen.getAllByText('Institution')
    expect(institutionBadges.length).toBeGreaterThan(0)
  })

  it('renders status badges correctly', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    const pendingBadges = screen.getAllByText('Pending')
    expect(pendingBadges.length).toBeGreaterThan(0)
    
    const approvedBadges = screen.getAllByText('Approved')
    expect(approvedBadges.length).toBeGreaterThan(0)
    
    const rejectedBadges = screen.getAllByText('Rejected')
    expect(rejectedBadges.length).toBeGreaterThan(0)
  })

  it('renders action buttons for each request', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    const viewButtons = screen.getAllByLabelText('View request details')
    expect(viewButtons.length).toBeGreaterThan(0)
  })

  it('renders approve and reject buttons for pending requests', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    const approveButtons = screen.getAllByLabelText('Approve request')
    const rejectButtons = screen.getAllByLabelText('Reject request')
    
    expect(approveButtons.length).toBeGreaterThan(0)
    expect(rejectButtons.length).toBeGreaterThan(0)
  })

  it('allows searching requests', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    const searchInput = screen.getByPlaceholderText('Search requests...') as HTMLInputElement
    
    fireEvent.change(searchInput, { target: { value: 'John' } })
    
    expect(searchInput.value).toBe('John')
  })

  it('allows filtering by status', () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    // Select element is found by display value or label.
    // The select options have text "All Status", "Pending", etc.
    // We can get the select by finding the option 'All Status' parent?
    // Or just by role if there are multiple.
    
    // Using display value for select might be tricky with custom implementation, but here it's native select.
    // screen.getByDisplayValue('All Status')
    
    const statusSelect = screen.getByDisplayValue('All Status') as HTMLSelectElement
    
    fireEvent.change(statusSelect, { target: { value: 'pending' } })
    
    expect(statusSelect.value).toBe('pending')
  })

  it('opens modal when view button is clicked', async () => {
    renderWithRouter(<AdminVerificationRequestsPage />)
    
    const viewButtons = screen.getAllByLabelText('View request details')
    fireEvent.click(viewButtons[0])
    
    await waitFor(() => {
      expect(screen.getByText('Verification Request Details')).toBeInTheDocument()
    })
  })
})
