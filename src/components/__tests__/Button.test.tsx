import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Simple Button component for testing
function Button({ children, onClick, disabled = false }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders button in disabled state', () => {
    render(<Button disabled>Disabled button</Button>);
    const button = screen.getByText('Disabled button');
    expect(button).toBeDisabled();
  });

  it('applies correct CSS classes', () => {
    render(<Button>Styled button</Button>);
    const button = screen.getByText('Styled button');
    expect(button).toHaveClass('px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded');
  });
});