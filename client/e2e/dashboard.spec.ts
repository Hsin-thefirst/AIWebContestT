import { test, expect } from '@playwright/test';

test('dashboard has title and key sections', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Smart Booking Campus/);
  await expect(page.locator('section:has-text("Upcoming Events")')).toBeVisible();
  await expect(page.locator('section:has-text("Quick Book")')).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Book a Space');
  await expect(page).toHaveURL(/\/booking/);
});
