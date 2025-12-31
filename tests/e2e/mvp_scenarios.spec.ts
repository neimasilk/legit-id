import { test, expect } from '@playwright/test';

test.describe('LEGIT-ID MVP User Journey', () => {
  const timestamp = Date.now();
  const userEmail = `test.user.${timestamp}@example.com`;
  const userPassword = 'Password123!';
  const userName = `Test User ${timestamp}`;

  test('Complete User Flow: Register -> Dashboard -> Create Identity -> Profile -> Logout -> Login', async ({ page }) => {
    // 1. Register
    console.log(`Starting registration for ${userEmail}`);
    await page.goto('/register');
    
    await page.fill('#fullName', userName);
    await page.fill('#email', userEmail);
    await page.fill('#password', userPassword);
    await page.fill('#confirmPassword', userPassword);
    
    // Select role (click the button)
    await page.click('button:has-text("Individual")');
    
    await page.click('button[type="submit"]');

    // 2. Verify Dashboard (Auto-login after register)
    await expect(page).toHaveURL('/dashboard');
    
    // Wait for loading to finish if present
    await expect(page.getByText('Loading...')).toBeHidden({ timeout: 10000 });
    
    // Use regex for partial text match or exact match depending on UI
    await expect(page.getByText(/Welcome back,/)).toBeVisible();
    
    // 3. Verify Menu Items (Header)
    const menuItems = ['Dashboard', 'Verification', 'Profile'];
    for (const item of menuItems) {
      // Use exact: true to avoid matching "Edit Profile" or similar
      // Also ensure we are looking at the header navigation if possible, but exact match usually suffices for "Profile" vs "Edit Profile"
      await expect(page.getByRole('link', { name: item, exact: true }).first()).toBeVisible();
    }

    // 4. Create Identity Flow
    // Click "Create Identity" button in the dashboard body
    await page.click('a[href="/identity/create"]');
    await expect(page).toHaveURL('/identity/create');
    await expect(page.getByText('Create Digital Identity')).toBeVisible();

    // Step 1: Personal Information
    await page.fill('#fullName', userName); // Should be auto-filled? Maybe not in this impl
    await page.fill('#dateOfBirth', '1990-01-01');
    await page.fill('#idNumber', '1234567890');
    await page.click('button:has-text("Next Step")');

    // Step 2: Document Upload (Skipping actual upload for now, just proceeding)
    await expect(page.getByText('Upload Documents')).toBeVisible();
    await page.click('button:has-text("Review")');

    // Step 3: Review & Submit
    await expect(page.getByText('Review Your Information')).toBeVisible();
    await page.click('button:has-text("Continue to Blockchain")');

    // Step 4: Blockchain Verification
    await expect(page.getByRole('heading', { name: 'Blockchain Verification' })).toBeVisible(); // Title of step 4
    await page.click('button:has-text("Submit Application")');

    // 5. Verify Redirect to Dashboard and Status
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Digital Identity Status')).toBeVisible();
    // Check for status badge specifically
    // Using first() is acceptable here as we just want to confirm "Pending" is visible on the page
    await expect(page.getByText('Pending', { exact: false }).first()).toBeVisible();

    // 6. Navigate to Profile
    await page.click('a[href="/profile"]');
    await expect(page).toHaveURL('/profile');
    // Profile page content checks
    // Use first() to avoid strict mode violations if name appears in header and body
    await expect(page.getByText(userName).first()).toBeVisible();
    await expect(page.getByText(userEmail).first()).toBeVisible();
    await expect(page.getByText('Individual').first()).toBeVisible();

    // 7. Logout
    await page.click('button:has-text("Logout")'); // Header button text is "Logout"
    await expect(page).toHaveURL('/'); // Redirects to Home (/) not Login (/login) based on Header.tsx

    // 8. Login again
    await page.goto('/login');
    await page.fill('#email', userEmail);
    await page.fill('#password', userPassword);
    await page.click('button[type="submit"]');

    // 9. Verify Dashboard again
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/Welcome back,/)).toBeVisible();
  });
});
