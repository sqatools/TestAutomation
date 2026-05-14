import { test, expect } from '@playwright/test';
import { AutomationPracticePage } from './page-objects/automationPracticePage';

const practiceUrl = 'https://sqatools.in/automation-practice-page/';
const demoFilePath = 'demo_file.txt';

test.describe('SQA Tools Automation Practice Page', () => {
  test('should automate key interactions using the page object model', async ({ page }) => {
    const practicePage = new AutomationPracticePage(page);
    await practicePage.goto();
    await expect(page).toHaveURL(practiceUrl);

    await practicePage.fillCredentials('demo_user', 'SecretPassword1!');
    await practicePage.chooseGender('female');
    await practicePage.toggleSkills(['Java', 'Selenium']);
    await practicePage.selectCountry('India');

    await expect(practicePage.usernameInput).toHaveValue('demo_user');
    await expect(practicePage.passwordInput).toHaveValue('SecretPassword1!');
    await expect(practicePage.femaleRadio).toBeChecked();
    await expect(practicePage.javaCheckbox).toBeChecked();
    await expect(practicePage.seleniumCheckbox).toBeChecked();
    await expect(practicePage.countrySelect).toHaveValue('india');

    await practicePage.clickNormalButton();
    await practicePage.clickResetButton();

    const alertMessage = await practicePage.acceptSimpleAlert();
    expect(alertMessage).toContain('This is a simple alert!');

    const confirmMessage = await practicePage.handleConfirmAlert(true);
    expect(confirmMessage).toContain('Do you want to continue?');

    const promptMessage = await practicePage.submitPromptAlert('Playwright');
    expect(promptMessage).toContain('Enter your name:');

    await practicePage.uploadFile(demoFilePath);
    await expect(practicePage.fileUploadInput).toHaveValue(/demo_file\.txt/);

    await practicePage.fillDateTime('2026-12-31', '12:15', '2026-12-31T12:15');
    await expect(practicePage.datePicker).toHaveValue('2026-12-31');
    await expect(practicePage.timePicker).toHaveValue('12:15');
    await expect(practicePage.dateTimePicker).toHaveValue('2026-12-31T12:15');

    const googlePage = await practicePage.openGoogleLink();
    await expect(googlePage).toHaveURL(/https:\/\/www\.google\.com/);
    await googlePage.close();

    await expect(practicePage.iframe).toBeVisible();
    await practicePage.hoverOverButton();

    await practicePage.fillCommentForm(
      'This is a Playwright page object model test.',
      'Demo Tester',
      'demo@test.com',
      'https://example.com'
    );

    await expect(practicePage.commentTextArea).toHaveValue('This is a Playwright page object model test.');
    await expect(practicePage.commentName).toHaveValue('Demo Tester');
    await expect(practicePage.commentEmail).toHaveValue('demo@test.com');
    await expect(practicePage.commentWebsite).toHaveValue('https://example.com');
  });
});
