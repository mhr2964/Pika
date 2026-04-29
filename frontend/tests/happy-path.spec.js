import { test, expect } from '@playwright/test';

test('Create room and display code', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Create Room');
  await page.click('button:has-text("Create Room")');
  await expect(page.locator('p:has-text("Share this code")')).toBeVisible();
  const code = await page.locator('p[style*="monospace"]').textContent();
  expect(code).toMatch(/^[A-Z0-9]{6,}$/);
});

test('Join room by code', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Join Room');
  await page.fill('input[placeholder="Enter code"]', 'ABCD12');
  await page.click('button:has-text("Join")');
  // TODO: backend will validate code; test expects room state or error
  await expect(page.locator('h1')).toBeVisible();
});

test('Room state shows participants', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Create Room');
  await page.click('button:has-text("Create Room")');
  await page.waitForNavigation();
  await expect(page.locator('h2:has-text("Participants")')).toBeVisible();
});

test('Toggle ready status', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Create Room');
  await page.click('button:has-text("Create Room")');
  await page.waitForNavigation();
  const button = page.locator('button:has-text("Mark Ready")');
  await button.click();
  await expect(button).toContainText('Ready');
});

test('Submit result flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Create Room');
  await page.click('button:has-text("Create Room")');
  await page.waitForNavigation();
  await page.click('button:has-text("Mark Ready")');
  // Simulate second participant ready
  await page.click('button:has-text("Enter Results")');
  await page.fill('textarea[placeholder="Your result or choice..."]', 'Option A');
  await page.click('button:has-text("Submit Result")');
  await expect(page.locator('text=Matchup Complete')).toBeVisible();
});

test('Restart from resolved state', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Create Room');
  await page.click('button:has-text("Create Room")');
  await page.waitForNavigation();
  await page.click('button:has-text("Mark Ready")');
  await page.click('button:has-text("Enter Results")');
  await page.fill('textarea[placeholder="Your result or choice..."]', 'Option A');
  await page.click('button:has-text("Submit Result")');
  await page.click('button:has-text("Start Another Matchup")');
  await expect(page.locator('text=Create Room')).toBeVisible();
});