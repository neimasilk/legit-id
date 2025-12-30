import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../HomePage';
import { BrowserRouter } from 'react-router-dom';

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  it('renders hero section correctly', () => {
    renderHomePage();
    
    expect(screen.getByText('Secure Digital Identity')).toBeInTheDocument();
    expect(screen.getByText('Verification Platform')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders statistics section', () => {
    renderHomePage();
    
    expect(screen.getByText('Verified Users')).toBeInTheDocument();
    expect(screen.getByText('50K+')).toBeInTheDocument();
    expect(screen.getByText('Partner Institutions')).toBeInTheDocument();
    expect(screen.getByText('200+')).toBeInTheDocument();
    expect(screen.getByText('Successful Verifications')).toBeInTheDocument();
    expect(screen.getByText('1M+')).toBeInTheDocument();
  });

  it('renders features section', () => {
    renderHomePage();
    
    expect(screen.getByText('Why Choose LEGIT-ID?')).toBeInTheDocument();
    expect(screen.getByText('Blockchain Security')).toBeInTheDocument();
    expect(screen.getByText('Universal Verification')).toBeInTheDocument();
    expect(screen.getByText('Privacy Control')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    renderHomePage();
    
    expect(screen.getByText('Ready to Secure Your Digital Identity?')).toBeInTheDocument();
    expect(screen.getByText('Create Your Identity Now')).toBeInTheDocument();
  });
});
