import { test, expect } from '@playwright/test';
import { AutomationPracticePage } from './page-objects/automationPracticePage';

const practiceUrl = 'https://sqatools.in/automation-practice-page/';

test.describe('SQA Tools Automation Practice Page - Dialog flows', () => {
  test('should handle alert, confirm, and prompt dialogs', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);
    await practicePage.goto();
    await expect(page).toHaveURL(practiceUrl);

    const alertMessage = await practicePage.acceptSimpleAlert();
    expect(alertMessage).toBe('This is a simple alert!');

    const confirmMessage = await practicePage.handleConfirmAlert(true);
    expect(confirmMessage).toBe('Do you want to continue?');

    const promptMessage = await practicePage.submitPromptAlert('Playwright');
    expect(promptMessage).toBe('Enter your name:');
  });
});
