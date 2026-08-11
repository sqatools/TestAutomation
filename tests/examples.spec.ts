import { test, expect } from '@playwright/test';
import { AutomationPracticePage } from './page-objects/automationPracticePage';

const practiceUrl = 'https://sqatools.in/automation-practice-page/';
const demoFilePath = 'demo_file.txt';

test.describe('SQA Tools - Complete Automation Example', () => {
  let practicePage: AutomationPracticePage;

  test.beforeEach(async ({ page }) => {
    // Initialize page object before each test
    practicePage = new AutomationPracticePage(page);
    await practicePage.goto();
  });

  test('Example 1: Form Filling and Validation and Verify', async ({ page }) => {
    // Example demonstrates: text input, radio buttons, checkboxes, dropdown selection
    
    await test.step('Navigate to practice page', async () => {
      await expect(page).toHaveURL(practiceUrl);
      console.log('✓ Successfully navigated to practice page');
    });

    await test.step('Fill user credentials and verify', async () => {
      await practicePage.fillCredentials('automation_user', 'TestPassword123!');
      await expect(practicePage.usernameInput).toHaveValue('automation_user');
      await expect(practicePage.passwordInput).toHaveValue('TestPassword123!');
      console.log('✓ Credentials filled successfully');
    });

    await test.step('Select gender - Female', async () => {
      await practicePage.chooseGender('female');
      await expect(practicePage.femaleRadio).toBeChecked();
      console.log('✓ Gender selection: Female');
    });

    await test.step('Select programming skills and verify', async () => {
      await practicePage.toggleSkills(['Python', 'Selenium']);
      await expect(practicePage.pythonCheckbox).toBeChecked();
      await expect(practicePage.seleniumCheckbox).toBeChecked();
      console.log('✓ Skills selected: Python, Selenium');
    });

    await test.step('Select country from dropdown and verify', async () => {
      await practicePage.selectCountry('USA');
      await expect(practicePage.countrySelect).toHaveValue('usa');
      console.log('✓ Country selected: USA');
    });

    await test.step('Verify all selections', async () => {
      const username = await practicePage.usernameInput.inputValue();
      const password = await practicePage.passwordInput.inputValue();
      const isFemaleSelected = await practicePage.femaleRadio.isChecked();
      
      expect(username).toBe('automation_user');
      expect(password).toBe('TestPassword123!');
      expect(isFemaleSelected).toBe(true);
      console.log('✓ All form selections verified');
    });
  });

  test('Example 2: Button Interactions and Actions', async ({ page }) => {
    // Example demonstrates: button clicks, element visibility, action sequences

    await test.step('Navigate and verify page loaded', async () => {
      await expect(page).toHaveURL(practiceUrl);
    });

    await test.step('Click normal button', async () => {
      await practicePage.clickNormalButton();
      console.log('✓ Normal button clicked');
    });

    await test.step('Click submit button', async () => {
      await practicePage.clickSubmitButton();
      console.log('✓ Submit button clicked');
    });

    await test.step('Click reset button', async () => {
      await practicePage.clickResetButton();
      console.log('✓ Reset button clicked');
    });

    await test.step('Hover over button and verify visibility', async () => {
      await practicePage.hoverOverButton();
      await expect(practicePage.hoverButton).toBeVisible();
      console.log('✓ Hover button interaction successful');
    });
  });

  test('Example 3: File Upload and DateTime Selection', async ({ page }) => {
    // Example demonstrates: file upload, date/time input handling

    await test.step('Upload file', async () => {
      await practicePage.uploadFile(demoFilePath);
      const fileInput = await practicePage.fileUploadInput.inputValue();
      expect(fileInput).toContain('demo_file.txt');
      console.log('✓ File uploaded: demo_file.txt');
    });

    await test.step('Fill date picker', async () => {
      const testDate = '2026-12-25';
      await practicePage.datePicker.fill(testDate);
      await expect(practicePage.datePicker).toHaveValue(testDate);
      console.log(`✓ Date selected: ${testDate}`);
    });

    await test.step('Fill time picker', async () => {
      const testTime = '14:30';
      await practicePage.timePicker.fill(testTime);
      await expect(practicePage.timePicker).toHaveValue(testTime);
      console.log(`✓ Time selected: ${testTime}`);
    });

    await test.step('Fill datetime picker', async () => {
      const testDateTime = '2026-12-25T14:30';
      await practicePage.dateTimePicker.fill(testDateTime);
      await expect(practicePage.dateTimePicker).toHaveValue(testDateTime);
      console.log(`✓ DateTime selected: ${testDateTime}`);
    });
  });

  test('Example 4: Dialog Handling (Alerts, Confirms, Prompts)', async ({ page }) => {
    // Example demonstrates: handling JavaScript dialogs with Allure integration

    await test.step('Handle simple alert', async () => {
      const alertMessage = await practicePage.acceptSimpleAlert();
      expect(alertMessage).toBe('This is a simple alert!');
      console.log(`✓ Alert handled: "${alertMessage}"`);
    });

    await test.step('Handle confirm dialog - Accept', async () => {
      const confirmMessage = await practicePage.handleConfirmAlert(true);
      expect(confirmMessage).toBe('Do you want to continue?');
      console.log(`✓ Confirm accepted: "${confirmMessage}"`);
    });

    await test.step('Handle prompt dialog - Submit value', async () => {
      const promptMessage = await practicePage.submitPromptAlert('Playwright Automation');
      expect(promptMessage).toBe('Enter your name:');
      console.log(`✓ Prompt submitted: "${promptMessage}"`);
    });
  });

  test('Example 5: Navigation and New Window Handling', async ({ page, context }) => {
    // Example demonstrates: external link navigation, multiple page handling

    await test.step('Click external link to Google', async () => {
      const newPage = await practicePage.openGoogleLink();
      await expect(newPage).toHaveURL(/google\.com/);
      console.log('✓ Navigated to Google in new window');
      await newPage.close();
    });
  });

  test('Example 6: iFrame Visibility and Scrolling', async ({ page }) => {
    // Example demonstrates: iframe handling, page scrolling

    await test.step('Verify iframe is visible', async () => {
      await expect(practicePage.iframe).toBeVisible();
      console.log('✓ iFrame is visible on page');
    });

    await test.step('Scroll to iframe and verify position', async () => {
      await practicePage.iframe.scrollIntoViewIfNeeded();
      await expect(practicePage.iframe).toBeInViewport();
      console.log('✓ iFrame scrolled into view');
    });
  });

  test('Example 7: Form Submission with Complete Data', async ({ page }) => {
    // Example demonstrates: end-to-end form filling and verification

    const testData = {
      username: 'e2e_automation_user',
      password: 'SecurePass@2026',
      gender: 'male' as const,
      skills: ['Java', 'Selenium'] as const,
      country: 'India',
      comment: 'This is an automated test using Playwright and Allure',
      name: 'QA Automation',
      email: 'qa@sqatools.in',
      website: 'https://sqatools.in',
    };

    await test.step('Fill all form fields', async () => {
      await practicePage.fillCredentials(testData.username, testData.password);
      await practicePage.chooseGender(testData.gender);
      await practicePage.toggleSkills(testData.skills);
      await practicePage.selectCountry(testData.country);
      console.log('✓ Form fields populated');
    });

    await test.step('Verify form data', async () => {
      await expect(practicePage.usernameInput).toHaveValue(testData.username);
      await expect(practicePage.passwordInput).toHaveValue(testData.password);
      await expect(practicePage.maleRadio).toBeChecked();
      await expect(practicePage.javaCheckbox).toBeChecked();
      await expect(practicePage.seleniumCheckbox).toBeChecked();
      await expect(practicePage.countrySelect).toHaveValue(testData.country.toLowerCase());
      console.log('✓ All form data verified');
    });

    await test.step('Fill comment form', async () => {
      await practicePage.fillCommentForm(
        testData.comment,
        testData.name,
        testData.email,
        testData.website
      );
      console.log('✓ Comment form filled');
    });

    await test.step('Verify comment data', async () => {
      await expect(practicePage.commentTextArea).toHaveValue(testData.comment);
      await expect(practicePage.commentName).toHaveValue(testData.name);
      await expect(practicePage.commentEmail).toHaveValue(testData.email);
      await expect(practicePage.commentWebsite).toHaveValue(testData.website);
      console.log('✓ Comment data verified');
    });
  });

  test('Example 8: Error Handling and Retry Logic', async ({ page }) => {
    // Example demonstrates: error handling, element waiting, retry mechanisms

    await test.step('Wait for element with timeout', async () => {
      try {
        await practicePage.usernameInput.waitFor({ timeout: 5000 });
        console.log('✓ Element found within timeout');
      } catch (error) {
        console.error('✗ Element not found:', error);
        throw error;
      }
    });

    await test.step('Verify element is interactive', async () => {
      const isEnabled = await practicePage.usernameInput.isEnabled();
      expect(isEnabled).toBe(true);
      console.log('✓ Element is enabled and interactive');
    });

    await test.step('Fill with error recovery', async () => {
      try {
        await practicePage.usernameInput.fill('test_user_123');
        const value = await practicePage.usernameInput.inputValue();
        expect(value).toBe('test_user_123');
        console.log('✓ Input filled successfully with error handling');
      } catch (error) {
        console.error('✗ Fill operation failed:', error);
        throw error;
      }
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Cleanup after each test
    console.log(`\n✓ Test: ${testInfo.title} - ${testInfo.status}`);
    if (testInfo.status === 'failed') {
      console.error(`✗ Test failed. Check test-results for details.`);
    }
  });
});

