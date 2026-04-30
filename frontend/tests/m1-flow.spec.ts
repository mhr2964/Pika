import { expect, test } from '@playwright/test';

test('completes the single-prompt to saved-result flow', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Turn one prompt into one saved useful thing.')).toBeVisible();
  await page.getByRole('button', { name: 'Generate result' }).click();

  await expect(page.getByText('Pika is turning your prompt into something keeper-worthy.')).toBeVisible();
  await expect(page.getByText('Fresh result')).toBeVisible();

  await page.getByRole('button', { name: 'Save result' }).click();
  await expect(page.getByText('Saved. Your tiny lightning bolt is tucked away.')).toBeVisible();

  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.getByText('Last saved')).toBeVisible();
});

test('shows an error and recovers back to input when generation fails', async ({ page }) => {
  await page.goto('/');

  await page
    .getByLabel('What do you need figured out?')
    .fill('fail this prompt on purpose');

  await page.getByRole('button', { name: 'Generate result' }).click();

  await expect(page.getByRole('alert')).toContainText('Pika hit a weird little snag.');
  await expect(page.getByRole('button', { name: 'Generate result' })).toBeVisible();
});