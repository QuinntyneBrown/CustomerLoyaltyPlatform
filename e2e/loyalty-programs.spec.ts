import { test, expect } from '@playwright/test';

test.describe('Loyalty Programs', () => {
  const testTenantId = '123e4567-e89b-12d3-a456-426614174000';
  const testProgramId = '423e4567-e89b-12d3-a456-426614174003';

  test.describe('Program List Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/tenants/${testTenantId}/programs`);
    });

    test('should display programs page title', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Loyalty Programs');
    });

    test('should display create program button', async ({ page }) => {
      const createButton = page.locator('a:has-text("Create Program")');
      await expect(createButton).toBeVisible();
    });

    test('should navigate to create program page when clicking create button', async ({ page }) => {
      await page.click('a:has-text("Create Program")');
      await expect(page).toHaveURL(new RegExp(`/tenants/${testTenantId}/programs/create`));
      await expect(page.locator('h1')).toHaveText('Create Loyalty Program');
    });

    test('should display program table with correct columns', async ({ page }) => {
      const table = page.locator('mat-table, table');
      await expect(table).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
      const backButton = page.locator('button[aria-label="Go back"], a[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });
  });

  test.describe('Program Create Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/tenants/${testTenantId}/programs/create`);
    });

    test('should display create program form', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Create Loyalty Program');
      await expect(page.locator('input[formControlName="programName"]')).toBeVisible();
      await expect(page.locator('input[formControlName="pointsName"]')).toBeVisible();
    });

    test('should have back button', async ({ page }) => {
      const backButton = page.locator('button[aria-label="Go back"]');
      await expect(backButton).toBeVisible();
    });

    test('should navigate back when clicking back button', async ({ page }) => {
      await page.click('button[aria-label="Go back"]');
      await expect(page).toHaveURL(new RegExp(`/tenants/${testTenantId}/programs$`));
    });

    test('should have program type selector', async ({ page }) => {
      const typeSelect = page.locator('mat-select[formControlName="programType"]');
      await expect(typeSelect).toBeVisible();

      await typeSelect.click();
      await expect(page.locator('mat-option:has-text("Points")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Stamps")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("Tier")')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.click('button[type="submit"]');
      await expect(page.locator('input[formControlName="programName"]')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  test.describe('Earning Rule Create Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/tenants/${testTenantId}/programs/${testProgramId}/earning-rules/create`);
    });

    test('should display earning rule form', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Configure Earning Rule');
      await expect(page.locator('input[formControlName="pointsAmount"]')).toBeVisible();
    });

    test('should have rule type selector', async ({ page }) => {
      const typeSelect = page.locator('mat-select[formControlName="ruleType"]');
      await expect(typeSelect).toBeVisible();

      await typeSelect.click();
      await expect(page.locator('mat-option:has-text("PerDollar")')).toBeVisible();
      await expect(page.locator('mat-option:has-text("PerVisit")')).toBeVisible();
    });

    test('should have date pickers', async ({ page }) => {
      await expect(page.locator('input[formControlName="effectiveFrom"]')).toBeVisible();
      await expect(page.locator('input[formControlName="effectiveTo"]')).toBeVisible();
    });
  });
});
