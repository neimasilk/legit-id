import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminSystemSettingsPage from '../AdminSystemSettingsPage'
import { BrowserRouter } from 'react-router-dom'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AdminSystemSettingsPage', () => {
  it('renders system settings header', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    expect(screen.getByText('System Settings')).toBeInTheDocument()
    expect(screen.getByText('Configure system-wide settings and preferences')).toBeInTheDocument()
  })

  it('renders all setting tabs', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Blockchain')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('renders general settings by default', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    expect(screen.getByText('Site Name')).toBeInTheDocument()
    expect(screen.getByText('Site Description')).toBeInTheDocument()
    expect(screen.getByText('Maintenance Mode')).toBeInTheDocument()
    expect(screen.getByText('Allow Registration')).toBeInTheDocument()
    expect(screen.getByText('Default User Role')).toBeInTheDocument()
  })

  it('allows switching between tabs', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    // Click on Security tab
    fireEvent.click(screen.getByText('Security'))
    
    expect(screen.getByText('Minimum Password Length')).toBeInTheDocument()
    expect(screen.getByText('Require Strong Password')).toBeInTheDocument()
    expect(screen.getByText('Enable Two-Factor Authentication')).toBeInTheDocument()
  })

  it('renders security settings when security tab is clicked', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    fireEvent.click(screen.getByText('Security'))
    
    expect(screen.getByText('Session Timeout (minutes)')).toBeInTheDocument()
    expect(screen.getByText('Maximum Login Attempts')).toBeInTheDocument()
  })

  it('renders email settings when email tab is clicked', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    fireEvent.click(screen.getByText('Email'))
    
    expect(screen.getByText('SMTP Host')).toBeInTheDocument()
    expect(screen.getByText('SMTP Port')).toBeInTheDocument()
    expect(screen.getByText('Use Secure Connection (TLS/SSL)')).toBeInTheDocument()
    expect(screen.getByText('SMTP Username')).toBeInTheDocument()
    expect(screen.getByText('SMTP Password')).toBeInTheDocument()
  })

  it('renders blockchain settings when blockchain tab is clicked', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    fireEvent.click(screen.getByText('Blockchain'))
    
    expect(screen.getByText('Enable Blockchain Integration')).toBeInTheDocument()
    expect(screen.getByText('Network')).toBeInTheDocument()
    expect(screen.getByText('RPC URL')).toBeInTheDocument()
    expect(screen.getByText('Contract Address')).toBeInTheDocument()
  })

  it('renders notification settings when notifications tab is clicked', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    fireEvent.click(screen.getByText('Notifications'))
    
    expect(screen.getByText('User Notifications')).toBeInTheDocument()
    expect(screen.getByText('Email Verification')).toBeInTheDocument()
    expect(screen.getByText('SMS Verification')).toBeInTheDocument()
    expect(screen.getByText('General User Alerts')).toBeInTheDocument()
    expect(screen.getByText('Admin Alerts')).toBeInTheDocument()
  })

  it('renders save settings button', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    expect(screen.getByRole('button', { name: /save settings/i })).toBeInTheDocument()
  })

  it('allows toggling checkboxes', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    const maintenanceCheckbox = screen.getByLabelText('Maintenance Mode') as HTMLInputElement
    const registrationCheckbox = screen.getByLabelText('Allow Registration') as HTMLInputElement
    
    expect(maintenanceCheckbox.checked).toBe(false)
    expect(registrationCheckbox.checked).toBe(true)
    
    fireEvent.click(maintenanceCheckbox)
    fireEvent.click(registrationCheckbox)
    
    expect(maintenanceCheckbox.checked).toBe(true)
    expect(registrationCheckbox.checked).toBe(false)
  })

  it('allows changing text input values', () => {
    renderWithRouter(<AdminSystemSettingsPage />)
    
    const siteNameInput = screen.getByDisplayValue('LEGIT-ID') as HTMLInputElement
    
    fireEvent.change(siteNameInput, { target: { value: 'NEW-LEGIT-ID' } })
    
    expect(siteNameInput.value).toBe('NEW-LEGIT-ID')
  })
})