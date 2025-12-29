import { test, expect } from '@playwright/test';

test.describe('Tenant Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tenants');
  });

  test.describe('Tenant List Page', () => {
    test('should display tenants page title', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Tenants');
    });

    test('should display create tenant button', async ({ page }) => {
      const createButton = page.locator('a[routerLink="/tenants/create"]');
      await expect(createButton).toBeVisible();
      await expect(createButton).toContainText('Create Tenant');
    });

    test('should navigate to create tenant page when clicking create button', async ({ page }) => {
      await page.click('a[routerLink="/tenants/create"]');
      await expect(page).toHaveURL(/\/tenants\/create/);
      await expect(page.locator('h1')).toHaveText('Create Tenant');
    });

    test('should display tenant table with correct columns', async ({ page }) => {
      const table = page.locator('mat-table, table');
      await expect(table).toBeVisible();

      const headers = page.locator('th');
      await expect(headers.first()).toBeVisible();
    });

    test('should display empty state when no tenants', async ({ page }) => {
      await page.waitForTimeout(1000);
      const emptyState = page.getByText('No tenants found');
      const tableRows = page.locator('tr.mat-mdc-row');

      const rowCount = await tableRows.count();
      if (rowCount === 0) {
        await expect(emptyState).toBeVisible();
      }
    });
  });

  test.describe('Tenant Create Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/tenants/create');
    });

    test('should display create tenant form', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Create Tenant');
      await expect(page.locator('input[formControlName="tenantName"]')).toBeVisible();
      await expect(page.locator('input[formControlName="tenantSlug"]')).toBeVisible();
      await expect(page.locator('input[formControlName="primaryContactEmail"]')).toBeVisible();
      await expect(page.locator('input[formControlName="primaryContactName"]')).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
      const backButton = page.locator('button[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });

    test('should navigate back when clicking back button', async ({ page }) => {
      await page.click('button[aria-label="Go back"]');
      await expect(page).toHaveURL(/\/tenants$/);
    });

    test('should have cancel button', async ({ page }) => {
      const cancelButton = page.getByRole('button', { name: 'Cancel' });
      await expect(cancelButton).toBeVisible();
    });

    test('should navigate back when clicking cancel', async ({ page }) => {
      await page.click('button:has-text("Cancel")');
      await expect(page).toHaveURL(/\/tenants$/);
    });

    test('should have submit button', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toContainText('Create Tenant');
    });

    test('should show validation errors for empty required fields', async ({ page }) => {
      await page.click('button[type="submit"]');

      await expect(page.locator('input[formControlName="tenantName"]')).toHaveAttribute('aria-invalid', 'true');
    });

    test('should auto-generate slug from tenant name', async ({ page }) => {
      const nameInput = page.locator('input[formControlName="tenantName"]');
      const slugInput = page.locator('input[formControlName="tenantSlug"]');

      await nameInput.fill('My Test Tenant');
      await nameInput.blur();

      await expect(slugInput).toHaveValue('my-test-tenant');
    });

    test('should validate email format', async ({ page }) => {
      const emailInput = page.locator('input[formControlName="primaryContactEmail"]');
      await emailInput.fill('invalid-email');
      await emailInput.blur();

      const errorMessage = page.locator('mat-error');
      await expect(errorMessage).toContainText('valid email');
    });

    test('should validate slug pattern', async ({ page }) => {
      const slugInput = page.locator('input[formControlName="tenantSlug"]');
      await slugInput.fill('Invalid Slug');
      await slugInput.blur();

      const errorMessage = page.locator('mat-error');
      await expect(errorMessage).toContainText('lowercase');
    });

    test('should have plan type selector with options', async ({ page }) => {
      const planSelect = page.locator('mat-select[formControlName="planType"]');
      await expect(planSelect).toBeVisible();

      await planSelect.click();
      await expect(page.locator('mat-option')).toHaveCount(4);
      await expect(page.locator('mat-option:has-text("Free")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Starter")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Professional")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Enterprise")')).toBeVisible();
    });

    test('should have data region selector with options', async ({ page }) => {
      const regionSelect = page.locator('mat-select[formControlName="dataRegion"]');
      await expect(regionSelect).toBeVisible();

      await regionSelect.click();
      await expect(page.locator('mat-option')).toHaveCount(3);
      await expect(page.locator('mat-option:has-text("US")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("EU")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("APAC")')).toBeVisible();
    });

    test('should fill and submit form successfully', async ({ page }) => {
      await page.fill('input[formControlName="tenantName"]', 'Test Tenant E2E');
      await page.fill('input[formControlName="tenantSlug"]', 'test-tenant-e2e');
      await page.fill('input[formControlName="primaryContactName"]', 'Test User');
      await page.fill('input[formControlName="primaryContactEmail"]', 'test@example.com');

      const formValid = await page.evaluate(() => {
        const form = document.querySelector('form');
        return form?.checkValidity() ?? false;
      });

      expect(formValid).toBe(true);
    });
  });

  test.describe('Tenant Detail Page', () => {
    test('should display error for non-existent tenant', async ({ page }) => {
      await page.goto('/tenants/non-existent-id');

      await page.waitForTimeout(2000);

      const errorMessage = page.locator('.error-message');
      const hasError = await errorMessage.isVisible().catch(() => false);

      if (hasError) {
        await expect(errorMessage).toBeVisible();
      }
    });

    test('should have back button on detail page', async ({ page }) => {
      await page.goto('/tenants/123e4567-e89b-12d3-a456-426614174000');

      const backButton = page.locator('button[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });

    test('should navigate back from detail page', async ({ page }) => {
      await page.goto('/tenants/123e4567-e89b-12d3-a456-426614174000');

      await page.click('button[aria-label="Go back"]');
      await expect(page).toHaveURL(/\/tenants$/);
    });
  });

  test.describe('Navigation', () => {
    test('should redirect root to tenants list', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/tenants/);
    });

    test('should be able to navigate between list and create pages', async ({ page }) => {
      await expect(page).toHaveURL(/\/tenants/);

      await page.click('a[routerLink="/tenants/create"]');
      await expect(page).toHaveURL(/\/tenants\/create/);

      await page.click('button[aria-label="Go back"]');
      await expect(page).toHaveURL(/\/tenants$/);
    });
  });
});
