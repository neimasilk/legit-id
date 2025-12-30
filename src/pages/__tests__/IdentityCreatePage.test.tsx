import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IdentityCreatePage from '../IdentityCreatePage';
import { BrowserRouter } from 'react-router-dom';

// Mock the auth store
const mockUser = { id: '123', email: 'test@example.com' };
vi.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    user: mockUser
  })
}));

// Mock the identity store
const mockCreateIdentity = vi.fn();
// We'll use a variable to control the return value of the hook if needed, 
// but for simplicity we'll stick to the basic mock and focus on logic flow.
vi.mock('../../stores/identityStore', () => ({
  useIdentityStore: () => ({
    createIdentity: mockCreateIdentity,
    loading: false,
    error: null // Default error
  })
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderIdentityCreatePage = () => {
  return render(
    <BrowserRouter>
      <IdentityCreatePage />
    </BrowserRouter>
  );
};

describe('IdentityCreatePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders multi-step form correctly', () => {
    renderIdentityCreatePage();
    
    expect(screen.getByText('Create Digital Identity')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Document Upload')).toBeInTheDocument();
    expect(screen.getByText('Review & Submit')).toBeInTheDocument();
  });

  it('shows step 1: Personal Information by default', () => {
    renderIdentityCreatePage();
    
    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth *')).toBeInTheDocument();
    expect(screen.getByLabelText('ID Number (KTP/Passport) *')).toBeInTheDocument();
  });

  it('proceeds to step 2 when step 1 is valid', async () => {
    renderIdentityCreatePage();
    
    // Fill step 1 fields
    await userEvent.type(screen.getByLabelText('Full Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Date of Birth *'), '1990-01-01');
    await userEvent.type(screen.getByLabelText('ID Number (KTP/Passport) *'), '1234567890');
    
    fireEvent.click(screen.getByText('Next Step'));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
      expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
    });
  });

  it('shows step 2: Document Upload after valid step 1', async () => {
    renderIdentityCreatePage();
    
    // Fill step 1 and proceed
    await userEvent.type(screen.getByLabelText('Full Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Date of Birth *'), '1990-01-01');
    await userEvent.type(screen.getByLabelText('ID Number (KTP/Passport) *'), '1234567890');
    fireEvent.click(screen.getByText('Next Step'));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
      expect(screen.getByText('PNG, JPG, PDF up to 10MB')).toBeInTheDocument();
      expect(screen.getByText('Choose Files')).toBeInTheDocument();
    });
  });

  it('proceeds to step 3 when step 2 is valid', async () => {
    renderIdentityCreatePage();
    
    // Fill step 1
    await userEvent.type(screen.getByLabelText('Full Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Date of Birth *'), '1990-01-01');
    await userEvent.type(screen.getByLabelText('ID Number (KTP/Passport) *'), '1234567890');
    fireEvent.click(screen.getByText('Next Step'));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    });
    
    // Note: File upload testing would require more complex mocking
    // Just proceed to step 3
    fireEvent.click(screen.getByText('Review'));
    
    await waitFor(() => {
      expect(screen.getByText('Review & Submit')).toBeInTheDocument();
    });
  });

  it('shows step 3: Review & Submit with all data', async () => {
    renderIdentityCreatePage();
    
    // Fill all steps up to 3
    await userEvent.type(screen.getByLabelText('Full Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Date of Birth *'), '1990-01-01');
    await userEvent.type(screen.getByLabelText('ID Number (KTP/Passport) *'), '1234567890');
    fireEvent.click(screen.getByText('Next Step'));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Review'));
    
    await waitFor(() => {
      expect(screen.getByText('Review & Submit')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('1990-01-01')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });
  });

  it('allows going back to previous steps', async () => {
    renderIdentityCreatePage();
    
    // Fill step 1 and proceed
    await userEvent.type(screen.getByLabelText('Full Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Date of Birth *'), '1990-01-01');
    await userEvent.type(screen.getByLabelText('ID Number (KTP/Passport) *'), '1234567890');
    fireEvent.click(screen.getByText('Next Step'));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    });
    
    // Go back
    fireEvent.click(screen.getByText('Previous'));
    
    await waitFor(() => {
      expect(screen.getByLabelText('Full Name *')).toHaveValue('John Doe');
    });
  });

  it('proceeds to step 4 (blockchain) from step 3', async () => {
    renderIdentityCreatePage();
    
    // Fill all steps up to 3
    await userEvent.type(screen.getByLabelText('Full Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Date of Birth *'), '1990-01-01');
    await userEvent.type(screen.getByLabelText('ID Number (KTP/Passport) *'), '1234567890');
    fireEvent.click(screen.getByText('Next Step'));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Review'));
    
    await waitFor(() => {
      expect(screen.getByText('Review & Submit')).toBeInTheDocument();
    });
    
    // Proceed to step 4 (blockchain)
    fireEvent.click(screen.getByText('Continue to Blockchain'));
    
    await waitFor(() => {
      const elements = screen.getAllByText('Blockchain Verification');
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('submits form successfully from step 4', async () => {
    renderIdentityCreatePage();
    
    // Fill all steps up to 4
    await userEvent.type(screen.getByLabelText('Full Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Date of Birth *'), '1990-01-01');
    await userEvent.type(screen.getByLabelText('ID Number (KTP/Passport) *'), '1234567890');
    fireEvent.click(screen.getByText('Next Step'));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Review'));
    
    await waitFor(() => {
      expect(screen.getByText('Review & Submit')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Continue to Blockchain'));
    
    await waitFor(() => {
      const elements = screen.getAllByText('Blockchain Verification');
      expect(elements.length).toBeGreaterThan(0);
    });
    
    // Mock successful submission (returns true)
    mockCreateIdentity.mockResolvedValueOnce(true);
    fireEvent.click(screen.getByText('Submit Application'));
    
    await waitFor(() => {
      expect(mockCreateIdentity).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles submission errors', async () => {
    renderIdentityCreatePage();
    
    // Fill all steps up to 4
    await userEvent.type(screen.getByLabelText('Full Name *'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Date of Birth *'), '1990-01-01');
    await userEvent.type(screen.getByLabelText('ID Number (KTP/Passport) *'), '1234567890');
    fireEvent.click(screen.getByText('Next Step'));
    
    await waitFor(() => {
      expect(screen.getByText('Upload Documents')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Review'));
    
    await waitFor(() => {
      expect(screen.getByText('Review & Submit')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Continue to Blockchain'));
    
    await waitFor(() => {
      const elements = screen.getAllByText('Blockchain Verification');
      expect(elements.length).toBeGreaterThan(0);
    });
    
    // Mock failed submission (returns false)
    mockCreateIdentity.mockResolvedValueOnce(false);
    fireEvent.click(screen.getByText('Submit Application'));
    
    await waitFor(() => {
      expect(mockCreateIdentity).toHaveBeenCalled();
      // Should NOT navigate
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('displays form validation summary', async () => {
    renderIdentityCreatePage();
    
    // Try to submit empty form
    fireEvent.click(screen.getByText('Next Step'));
    
    await waitFor(() => {
      expect(screen.getByText('Please correct the errors above')).toBeInTheDocument();
    });
  });
});