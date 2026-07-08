import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://sqatools.in/automation-practice-page/');
  await page.getByRole('textbox', { name: 'Enter username' }).click();
  await page.getByRole('textbox', { name: 'Enter username' }).fill('Rohit');
  await page.getByRole('textbox', { name: 'Enter username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Enter password' }).fill('sharma');
  await page.getByText('Enter address').dblclick();
  await page.getByText('Enter address').fill('');
  await page.getByText('Enter address').click();
  await page.getByText('Enter address').fill('12345');
  await page.getByText('Enter address').dblclick();
  await page.getByText('Enter address').fill('Pune, baner');
  await page.getByRole('radio', { name: 'Male', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Python' }).check();
  await page.locator('#skills').selectOption('Python');
  await page.locator('#skills').selectOption(['Python', 'Selenium']);
  await page.locator('#skills').selectOption(['Python', 'Selenium', 'Playwright']);
  await page.locator('#datePicker').fill('2026-07-16');
  await page.locator('#dateTimePicker').dblclick();
  await page.getByRole('button', { name: 'Load Success' }).click();
});