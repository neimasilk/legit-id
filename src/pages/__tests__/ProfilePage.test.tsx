import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../ProfilePage';
import { BrowserRouter } from 'react-router-dom';

// Mock the auth store
const mockUser = { 
  id: '123', 
  email: 'test@example.com', 
  full_name: 'Test User',
  role: 'individual'
};

vi.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    user: mockUser,
    isAuthenticated: true
  })
}));

const renderProfilePage = () => {
  return render(
    <BrowserRouter>
      <ProfilePage />
    </BrowserRouter>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile page with user information', () => {
    renderProfilePage();
    
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getAllByText('Test User').length).toBeGreaterThan(0);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Individual User')).toBeInTheDocument();
  });

  it('renders navigation tabs', () => {
    renderProfilePage();
    
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('shows personal info tab by default', () => {
    renderProfilePage();
    
    // Check for unique content in personal info tab
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('switches to notifications tab', () => {
    renderProfilePage();
    
    fireEvent.click(screen.getByText('Notifications'));
    
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('SMS Notifications')).toBeInTheDocument();
    expect(screen.getByText('Save Preferences')).toBeInTheDocument();
  });

  it('switches to privacy tab', () => {
    renderProfilePage();
    
    fireEvent.click(screen.getByText('Privacy'));
    
    // There are two "Privacy Settings" texts: H1 and H3.
    // We want to check if the tab content is visible.
    // The H3 "Privacy Settings" is inside the tab content.
    const headings = screen.getAllByText('Privacy Settings');
    expect(headings.length).toBeGreaterThan(0); // Should match at least one
    
    expect(screen.getByText('Profile Visibility')).toBeInTheDocument();
    expect(screen.getByText('Save Settings')).toBeInTheDocument();
  });

  it('switches to security tab', () => {
    renderProfilePage();
    
    fireEvent.click(screen.getByText('Security'));
    
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
    expect(screen.getByText('Update Security')).toBeInTheDocument();
  });

  it('renders notification toggles correctly', () => {
    renderProfilePage();
    fireEvent.click(screen.getByText('Notifications'));
    
    // Toggles are buttons. We can check if they exist.
    // We have 3 toggles in Notifications tab.
    // We can find them by the fact they are buttons inside the specific section?
    // Or just check that the labels are there.
    expect(screen.getByText('Receive notifications via email')).toBeInTheDocument();
    expect(screen.getByText('Receive notifications via SMS')).toBeInTheDocument();
  });

  it('renders privacy toggles correctly', () => {
    renderProfilePage();
    fireEvent.click(screen.getByText('Privacy'));
    
    expect(screen.getByText('Allow other users to see your profile')).toBeInTheDocument();
    expect(screen.getByText('Allow institutions to request verification')).toBeInTheDocument();
  });
});
