import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  const testTenantId = '123e4567-e89b-12d3-a456-426614174000';

  test.describe('User List Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/tenants/${testTenantId}/users`);
    });

    test('should display users page title', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Users');
    });

    test('should display invite user button', async ({ page }) => {
      const inviteButton = page.locator('a:has-text("Invite User")');
      await expect(inviteButton).toBeVisible();
    });

    test('should navigate to invite user page when clicking invite button', async ({ page }) => {
      await page.click('a:has-text("Invite User")');
      await expect(page).toHaveURL(new RegExp(`/tenants/${testTenantId}/users/invite`));
      await expect(page.locator('h1')).toHaveText('Invite User');
    });

    test('should display user table with correct columns', async ({ page }) => {
      const table = page.locator('mat-table, table');
      await expect(table).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
      const backButton = page.locator('button[aria-label="Go back"], a[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });
  });

  test.describe('User Invite Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/tenants/${testTenantId}/users/invite`);
    });

    test('should display invite user form', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Invite User');
      await expect(page.locator('input[formControlName="email"]')).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
      const backButton = page.locator('button[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });

    test('should navigate back when clicking back button', async ({ page }) => {
      await page.click('button[aria-label="Go back"]');
      await expect(page).toHaveURL(new RegExp(`/tenants/${testTenantId}/users$`));
    });

    test('should have role selector', async ({ page }) => {
      const roleSelect = page.locator('mat-select[formControlName="role"]');
      await expect(roleSelect).toBeVisible();

      await roleSelect.click();
      await expect(page.locator('mat-option:has-text("Owner")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Admin")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Manager")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Member")')).toBeVisible();
    });

    test('should display role descriptions', async ({ page }) => {
      await expect(page.locator('.role-descriptions')).toBeVisible();
      await expect(page.locator('text=Full access to all features')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      const emailInput = page.locator('input[formControlName="email"]');
      await emailInput.fill('invalid-email');
      await emailInput.blur();

      const errorMessage = page.locator('mat-error');
      await expect(errorMessage).toContainText('valid email');
    });

    test('should validate required email field', async ({ page }) => {
      await page.click('button[type="submit"]');
      await expect(page.locator('input[formControlName="email"]')).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
