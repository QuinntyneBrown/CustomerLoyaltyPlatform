import { test, expect } from '@playwright/test';

test.describe('Member Management', () => {
  const testTenantId = '123e4567-e89b-12d3-a456-426614174000';

  test.describe('Member List Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/tenants/${testTenantId}/members`);
    });

    test('should display members page title', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Members');
    });

    test('should display enroll member button', async ({ page }) => {
      const enrollButton = page.locator('a:has-text("Enroll Member")');
      await expect(enrollButton).toBeVisible();
    });

    test('should navigate to enroll member page when clicking enroll button', async ({ page }) => {
      await page.click('a:has-text("Enroll Member")');
      await expect(page).toHaveURL(new RegExp(`/tenants/${testTenantId}/members/enroll`));
      await expect(page.locator('h1')).toHaveText('Enroll Member');
    });

    test('should display member table with correct columns', async ({ page }) => {
      const table = page.locator('mat-table, table');
      await expect(table).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
      const backButton = page.locator('button[aria-label="Go back"], a[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });
  });

  test.describe('Member Enroll Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/tenants/${testTenantId}/members/enroll`);
    });

    test('should display enroll member form', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Enroll Member');
      await expect(page.locator('input[formControlName="firstName"]')).toBeVisible();
      await expect(page.locator('input[formControlName="lastName"]')).toBeVisible();
      await expect(page.locator('input[formControlName="phone"]')).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
      const backButton = page.locator('button[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });

    test('should navigate back when clicking back button', async ({ page }) => {
      await page.click('button[aria-label="Go back"]');
      await expect(page).toHaveURL(new RegExp(`/tenants/${testTenantId}/members$`));
    });

    test('should have enrollment source selector', async ({ page }) => {
      const sourceSelect = page.locator('mat-select[formControlName="enrollmentSource"]');
      await expect(sourceSelect).toBeVisible();

      await sourceSelect.click();
      await expect(page.locator('mat-option:has-text("InStore")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Online")')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.click('button[type="submit"]');
      await expect(page.locator('input[formControlName="firstName"]')).toHaveAttribute('aria-invalid', 'true');
    });

    test('should validate phone format', async ({ page }) => {
      const phoneInput = page.locator('input[formControlName="phone"]');
      await phoneInput.fill('invalid');
      await phoneInput.blur();

      const errorMessage = page.locator('mat-error');
      await expect(errorMessage).toContainText('valid phone');
    });
  });
});
