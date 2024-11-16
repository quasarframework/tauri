// TypeScript code for managing Playwright integration
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:4000');
  const title = await page.title();
  expect(title).toBe('Your Tauri App');
});
