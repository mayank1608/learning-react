// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';

// Unique email for registration tests to avoid conflicts
const uniqueEmail = `testuser_${Date.now()}@example.com`;

test.describe('Login Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-01: Login page loads successfully', async ({ page }) => {
    // Check page title contains expected text
    await expect(page).toHaveTitle(/ShopEY/i);

    // Check the sign-in heading is visible
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();

    // Check form elements are present
    await expect(page.locator('#login-email')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('TC-02: Login with valid credentials shows success', async ({ page }) => {
    // First register a user to ensure valid credentials exist
    const testEmail = `valid_login_${Date.now()}@example.com`;

    // Register via API
    const registerResponse = await page.request.post('/api/v1/auth/register', {
      data: {
        first_name: 'Test',
        last_name: 'User',
        email: testEmail,
        password: 'Test@1234',
      },
    });
    expect(registerResponse.status()).toBe(201);

    // Now login via the UI
    await page.locator('#login-email').fill(testEmail);
    await page.locator('#login-password').fill('Test@1234');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Expect success toast
    await expect(page.locator('.toast.success, .toast')).toContainText(/welcome back/i, { timeout: 5000 });
  });

  test('TC-03: Login with invalid email format shows error message', async ({ page }) => {
    await page.locator('#login-email').fill('invalid-email');
    await page.locator('#login-password').fill('SomePass@123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Expect inline validation error for email
    await expect(page.locator('.field-error')).toContainText(/invalid email format/i);
  });

  test('TC-04: Login with wrong password shows "Invalid email or password" error', async ({ page }) => {
    await page.locator('#login-email').fill('nonexistent@example.com');
    await page.locator('#login-password').fill('WrongPass@123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Expect error banner with generic message
    await expect(page.locator('.error-banner')).toContainText(/invalid email or password/i, { timeout: 5000 });
  });

  test('TC-05: Login with empty fields shows validation errors', async ({ page }) => {
    // Click submit without filling any fields
    await page.getByRole('button', { name: /sign in/i }).click();

    // Both email and password errors should appear
    const errors = page.locator('.field-error');
    await expect(errors.first()).toBeVisible();
    await expect(page.locator('.field-error').filter({ hasText: /email is required/i })).toBeVisible();
    await expect(page.locator('.field-error').filter({ hasText: /password is required/i })).toBeVisible();
  });

  test('TC-06: Password show/hide toggle works', async ({ page }) => {
    const passwordInput = page.locator('#login-password');
    const toggleBtn = page.locator('form .eye-toggle').first();

    await passwordInput.fill('SecretPass@1');

    // Initially password type is 'password' (hidden)
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle again to hide password
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Registration Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Switch to registration form
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
  });

  test('TC-07: Can switch to registration form', async ({ page }) => {
    // Already switched in beforeEach — verify registration form fields are visible
    await expect(page.locator('#reg-first')).toBeVisible();
    await expect(page.locator('#reg-last')).toBeVisible();
    await expect(page.locator('#reg-email')).toBeVisible();
    await expect(page.locator('#reg-password')).toBeVisible();
    await expect(page.locator('#reg-confirm')).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });

  test('TC-08: Register with valid data succeeds (201 response)', async ({ page }) => {
    const regEmail = `newuser_${Date.now()}@example.com`;

    await page.locator('#reg-first').fill('John');
    await page.locator('#reg-last').fill('Doe');
    await page.locator('#reg-email').fill(regEmail);
    await page.locator('#reg-password').fill('Strong@Pass1');
    await page.locator('#reg-confirm').fill('Strong@Pass1');

    await page.getByRole('button', { name: /register/i }).click();

    // Expect success toast and switch back to login form
    await expect(page.locator('.toast')).toContainText(/account created successfully/i, { timeout: 5000 });
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible({ timeout: 5000 });
  });

  test('TC-09: Register with duplicate email shows conflict error', async ({ page }) => {
    const dupEmail = `duplicate_${Date.now()}@example.com`;

    // Register first via API
    const registerResponse = await page.request.post('/api/v1/auth/register', {
      data: {
        first_name: 'Dup',
        last_name: 'User',
        email: dupEmail,
        password: 'Test@1234',
      },
    });
    expect(registerResponse.status()).toBe(201);

    // Try to register same email via UI
    await page.locator('#reg-first').fill('Another');
    await page.locator('#reg-last').fill('User');
    await page.locator('#reg-email').fill(dupEmail);
    await page.locator('#reg-password').fill('Test@1234');
    await page.locator('#reg-confirm').fill('Test@1234');

    await page.getByRole('button', { name: /register/i }).click();

    // Expect conflict error message
    await expect(page.locator('.field-error').filter({ hasText: /already registered/i })).toBeVisible({ timeout: 5000 });
  });

  test('TC-10: Register with weak password shows validation error', async ({ page }) => {
    await page.locator('#reg-first').fill('Jane');
    await page.locator('#reg-last').fill('Smith');
    await page.locator('#reg-email').fill('jane@example.com');
    await page.locator('#reg-password').fill('weak');
    await page.locator('#reg-confirm').fill('weak');

    await page.getByRole('button', { name: /register/i }).click();

    // Expect password validation error
    await expect(page.locator('.field-error').filter({ hasText: /at least 8 characters/i })).toBeVisible();
  });

  test('TC-11: Register with mismatched passwords shows error', async ({ page }) => {
    await page.locator('#reg-first').fill('Jane');
    await page.locator('#reg-last').fill('Smith');
    await page.locator('#reg-email').fill('jane2@example.com');
    await page.locator('#reg-password').fill('Strong@Pass1');
    await page.locator('#reg-confirm').fill('Different@Pass2');

    await page.getByRole('button', { name: /register/i }).click();

    // Expect mismatch error
    await expect(page.locator('.field-error').filter({ hasText: /passwords do not match/i })).toBeVisible();
  });

  test('TC-12: All registration fields are required', async ({ page }) => {
    // Submit empty form
    await page.getByRole('button', { name: /register/i }).click();

    // All required field errors should display
    await expect(page.locator('.field-error').filter({ hasText: /first name is required/i })).toBeVisible();
    await expect(page.locator('.field-error').filter({ hasText: /last name is required/i })).toBeVisible();
    await expect(page.locator('.field-error').filter({ hasText: /email is required/i })).toBeVisible();
    await expect(page.locator('.field-error').filter({ hasText: /password is required/i })).toBeVisible();
    await expect(page.locator('.field-error').filter({ hasText: /please confirm your password/i })).toBeVisible();
  });
});

test.describe('UI/UX Tests', () => {
  test('TC-13: Branding panel is visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const brandingPanel = page.locator('.branding-panel');
    await expect(brandingPanel).toBeVisible();
    await expect(page.locator('.brand-headline')).toContainText(/future of shopping/i);
  });

  test('TC-14: Responsive — branding panel hidden on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const brandingPanel = page.locator('.branding-panel');
    await expect(brandingPanel).not.toBeVisible();

    // Form should still be visible
    await expect(page.locator('#login-email')).toBeVisible();
  });

  test('TC-15: Form animations are smooth (no layout shift)', async ({ page }) => {
    await page.goto('/');

    // Get initial form position
    const formCard = page.locator('.form-card');
    const initialBox = await formCard.boundingBox();
    expect(initialBox).not.toBeNull();

    // Switch to register form
    await page.getByRole('button', { name: /sign up/i }).click();
    await page.waitForTimeout(500); // Wait for animation

    // Get position after switch — card should remain in same horizontal position
    const afterBox = await formCard.boundingBox();
    expect(afterBox).not.toBeNull();

    // X position should remain stable (no horizontal layout shift)
    expect(Math.abs(afterBox.x - initialBox.x)).toBeLessThan(5);
  });
});
