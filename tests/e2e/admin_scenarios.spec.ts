import { test, expect } from '@playwright/test';

test.describe('LEGIT-ID Admin Scenarios', () => {
  
  test('Admin Login and Dashboard Access', async ({ page }) => {
    // 1. Login as Admin
    // Using admin@example.com triggers the mock to return role='admin'
    await page.goto('http://localhost:4173/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 2. Verify Redirect to Dashboard (User Dashboard first)
    // The app redirects to /dashboard by default after login
    await expect(page).toHaveURL('/dashboard');
    // Check for "Welcome Back" or user name (Admin Name defaults to "Admin" or from metadata)
    // Mock user has fullName: 'Test User' by default, but let's check for Dashboard element
    await expect(page.getByText('Welcome Back')).toBeVisible();

    // 3. Verify Admin Link in Header
    // This link only appears if role === 'admin'
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();

    // 4. Navigate to Admin Dashboard
    await page.click('a[href="/admin"]');
    await expect(page).toHaveURL('/admin');
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();

    // 5. Verify Stats
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('Verified Users')).toBeVisible();

    // 6. Navigate to Verification Requests using Quick Actions
    // We updated the dashboard to use Links for Quick Actions
    await page.click('a[href="/admin/verification-requests"]');
    await expect(page).toHaveURL('/admin/verification-requests');
    await expect(page.getByRole('heading', { name: 'Verification Requests' })).toBeVisible();

    // 7. Verify Requests List
    // Check if mock data is rendered
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('TechCorp Solutions')).toBeVisible();

    // 8. Test Approve Button Interaction
    // Note: The current mock implementation only logs to console, so UI won't change status.
    // We just verify the button exists and is clickable.
    const approveButton = page.locator('button[aria-label="Approve request"]').first();
    await expect(approveButton).toBeVisible();
    await approveButton.click();

    // 9. Navigate to Users Management
    // We can go back or use URL. Let's use the browser back to Dashboard then Users.
    await page.goto('http://localhost:4173/admin');
    await page.click('a[href="/admin/users"]');
    await expect(page).toHaveURL('/admin/users');
    // Verify Users page content
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();

    // 10. Logout
    // Check if Header is loaded and User is logged in
    await expect(page.getByText('Test User')).toBeVisible();
    
    // Logout button is in the Header
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/');
  });
});
