import { test, expect } from '@playwright/test';

test.describe('Business Management', () => {
  const testTenantId = '123e4567-e89b-12d3-a456-426614174000';

  test.describe('Business List Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/tenants/${testTenantId}/businesses`);
    });

    test('should display businesses page title', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Businesses');
    });

    test('should display register business button', async ({ page }) => {
      const registerButton = page.locator('a:has-text("Register Business")');
      await expect(registerButton).toBeVisible();
    });

    test('should navigate to register business page when clicking register button', async ({ page }) => {
      await page.click('a:has-text("Register Business")');
      await expect(page).toHaveURL(new RegExp(`/tenants/${testTenantId}/businesses/register`));
      await expect(page.locator('h1')).toHaveText('Register Business');
    });

    test('should display business table with correct columns', async ({ page }) => {
      const table = page.locator('mat-table, table');
      await expect(table).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
      const backButton = page.locator('button[aria-label="Go back"], a[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });
  });

  test.describe('Business Register Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/tenants/${testTenantId}/businesses/register`);
    });

    test('should display register business form', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Register Business');
      await expect(page.locator('input[formControlName="businessName"]')).toBeVisible();
      await expect(page.locator('input[formControlName="ownerName"]')).toBeVisible();
      await expect(page.locator('input[formControlName="email"]')).toBeVisible();
      await expect(page.locator('input[formControlName="phone"]')).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
      const backButton = page.locator('button[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });

    test('should navigate back when clicking back button', async ({ page }) => {
      await page.click('button[aria-label="Go back"]');
      await expect(page).toHaveURL(new RegExp(`/tenants/${testTenantId}/businesses$`));
    });

    test('should have business type selector', async ({ page }) => {
      const typeSelect = page.locator('mat-select[formControlName="businessType"]');
      await expect(typeSelect).toBeVisible();

      await typeSelect.click();
      await expect(page.locator('mat-option:has-text("Retail")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Restaurant")')).toBeVisible();
    });

    test('should have address fields', async ({ page }) => {
      await expect(page.locator('input[formControlName="street"]')).toBeVisible();
      await expect(page.locator('input[formControlName="city"]')).toBeVisible();
      await expect(page.locator('input[formControlName="state"]')).toBeVisible();
      await expect(page.locator('input[formControlName="postalCode"]')).toBeVisible();
      await expect(page.locator('input[formControlName="country"]')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.click('button[type="submit"]');
      await expect(page.locator('input[formControlName="businessName"]')).toHaveAttribute('aria-invalid', 'true');
    });

    test('should validate email format', async ({ page }) => {
      const emailInput = page.locator('input[formControlName="email"]');
      await emailInput.fill('invalid-email');
      await emailInput.blur();

      const errorMessage = page.locator('mat-error');
      await expect(errorMessage).toContainText('valid email');
    });
  });
});
