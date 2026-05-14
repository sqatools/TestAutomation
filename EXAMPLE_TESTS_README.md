# Playwright Example Tests - Comprehensive Guide

## Overview

The `tests/examples.spec.ts` file contains **8 comprehensive test examples** demonstrating best practices for Playwright automation testing with **Page Object Model (POM)** and **Allure reporting integration**.

---

## Test Examples Breakdown

### 1. **Example 1: Form Filling and Validation**
Tests complete form submission workflow including text inputs, radio buttons, checkboxes, and dropdown selections.

**Features Demonstrated:**
- Text input filling (`fillCredentials`)
- Radio button selection (`chooseGender`)
- Checkbox toggling (`toggleSkills`)
- Dropdown selection (`selectCountry`)
- Value assertions and verification

**Use Case:** Ideal for testing registration forms, profile updates, or any multi-field form.

```typescript
// Example usage:
await practicePage.fillCredentials('automation_user', 'TestPassword123!');
await practicePage.chooseGender('female');
await practicePage.toggleSkills(['Python', 'Selenium']);
await practicePage.selectCountry('USA');
```

---

### 2. **Example 2: Button Interactions and Actions**
Tests various button click operations and hover actions on the page.

**Features Demonstrated:**
- Button clicks with different purposes (normal, submit, reset)
- Hover actions over elements
- Element visibility verification

**Use Case:** Validating button functionality, clickable elements, and hover effects.

```typescript
// Example usage:
await practicePage.clickNormalButton();
await practicePage.clickSubmitButton();
await practicePage.clickResetButton();
await practicePage.hoverOverButton();
```

---

### 3. **Example 3: File Upload and DateTime Selection**
Tests file upload functionality and date/time input handling.

**Features Demonstrated:**
- File upload (`uploadFile`)
- Date picker input
- Time picker input
- DateTime picker input
- Input value verification

**Use Case:** Testing file uploads, date ranges, appointment scheduling, or event creation.

```typescript
// Example usage:
await practicePage.uploadFile('demo_file.txt');
await practicePage.datePicker.fill('2026-12-25');
await practicePage.timePicker.fill('14:30');
await practicePage.dateTimePicker.fill('2026-12-25T14:30');
```

---

### 4. **Example 4: Dialog Handling (Alerts, Confirm, Prompts)**
Tests JavaScript dialog handling including alerts, confirms, and prompts.

**Features Demonstrated:**
- Alert dialog handling
- Confirm dialog with accept/dismiss
- Prompt dialog with value submission
- Dialog message verification

**Use Case:** Validating confirmation dialogs, user prompts, and alert messages in applications.

```typescript
// Example usage:
const alertMessage = await practicePage.acceptSimpleAlert();
const confirmMessage = await practicePage.handleConfirmAlert(true);
const promptMessage = await practicePage.submitPromptAlert('Playwright Automation');
```

---

### 5. **Example 5: Navigation and New Window Handling**
Tests external link navigation and handling multiple browser windows/tabs.

**Features Demonstrated:**
- External link clicking
- New window/tab detection
- Window switching and URL verification
- Window closure

**Use Case:** Testing navigation flows, external links, and multi-window interactions.

```typescript
// Example usage:
const newPage = await practicePage.openGoogleLink();
await expect(newPage).toHaveURL(/google\.com/);
await newPage.close();
```

---

### 6. **Example 6: iFrame Visibility and Scrolling**
Tests iframe element detection and page scrolling behavior.

**Features Demonstrated:**
- iFrame visibility check
- Element scroll-into-view
- Viewport visibility verification

**Use Case:** Validating embedded content, iframe loading, and scrolling behavior.

```typescript
// Example usage:
await expect(practicePage.iframe).toBeVisible();
await practicePage.iframe.scrollIntoViewIfNeeded();
await expect(practicePage.iframe).toBeInViewport();
```

---

### 7. **Example 7: Form Submission with Complete Data**
End-to-end test demonstrating complete form workflow with all field types.

**Features Demonstrated:**
- Structured test data using TypeScript types
- Form field completion
- Data verification across multiple elements
- Comment form submission

**Use Case:** Full user journey testing, registration to submission flow.

```typescript
// Example usage:
const testData = {
  username: 'e2e_automation_user',
  password: 'SecurePass@2026',
  gender: 'male',
  skills: ['Java', 'Selenium'],
  country: 'India',
  comment: 'Automated test comment',
  name: 'QA Automation',
  email: 'qa@sqatools.in',
  website: 'https://sqatools.in',
};
```

---

### 8. **Example 8: Error Handling and Retry Logic**
Tests error handling mechanisms, element waiting, and retry strategies.

**Features Demonstrated:**
- Try-catch error handling
- Element waitFor with timeout
- Element state verification
- Graceful error recovery

**Use Case:** Production-ready tests with robust error handling and recovery mechanisms.

```typescript
// Example usage:
try {
  await practicePage.usernameInput.waitFor({ timeout: 5000 });
  console.log('✓ Element found within timeout');
} catch (error) {
  console.error('✗ Element not found:', error);
  throw error;
}
```

---

## Running the Examples

### Run All Examples
```bash
npm run test:allure -- tests/examples.spec.ts
```

### Run Specific Example Test
```bash
npx playwright test tests/examples.spec.ts --grep "Example 1"
```

### Run Examples for Specific Browser
```bash
npx playwright test tests/examples.spec.ts --project=chromium
```

### Run with Headed Mode (View Browser)
```bash
npx playwright test tests/examples.spec.ts --headed
```

### Run with Debug Mode
```bash
npx playwright test tests/examples.spec.ts --debug
```

---

## Key Features Used

### Test Structure
```typescript
test.describe('SQA Tools - Complete Automation Example', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  });

  test('Example 1: Form Filling and Validation', async ({ page }) => {
    // Test implementation
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Cleanup after each test
  });
});
```

### Test Steps (Allure Integration)
```typescript
await test.step('Fill user credentials', async () => {
  await practicePage.fillCredentials('automation_user', 'TestPassword123!');
  console.log('✓ Credentials filled successfully');
});
```

Each step is tracked and reported in Allure for detailed test execution visualization.

---

## Best Practices Demonstrated

✅ **Page Object Model (POM)** - Encapsulating element interactions  
✅ **Test Steps** - Breaking tests into logical, trackable steps  
✅ **Error Handling** - Try-catch blocks for robust tests  
✅ **Logging** - Console output for test progression  
✅ **Data Management** - Using TypeScript types for test data  
✅ **Assertions** - Comprehensive expect() statements  
✅ **Cleanup** - Test teardown in afterEach hook  
✅ **Allure Reporting** - Integration for detailed test reports  

---

## Viewing Test Results

### HTML Report (Playwright)
```bash
npx playwright show-report
```

### Allure Report
```bash
npm run allure:generate
npm run allure:open
```

### Allure Live Report
```bash
npm run allure:serve
```

---

## Test Data

The examples use the following test data:

| Field | Value |
|-------|-------|
| Username | automation_user / e2e_automation_user |
| Password | TestPassword123! / SecurePass@2026 |
| Gender | male / female / other |
| Skills | Java, Python, Selenium |
| Country | USA, India, UK, Australia |
| File | demo_file.txt |
| Date | 2026-12-25 |
| Time | 14:30 |
| Email | qa@sqatools.in |
| Website | https://sqatools.in |

---

## Page Object Methods Reference

| Method | Purpose |
|--------|---------|
| `goto()` | Navigate to practice page |
| `fillCredentials(username, password)` | Fill login fields |
| `chooseGender(gender)` | Select gender radio button |
| `toggleSkills(skills)` | Check skill checkboxes |
| `selectCountry(country)` | Select from dropdown |
| `clickNormalButton()` | Click normal button |
| `clickSubmitButton()` | Click submit button |
| `clickResetButton()` | Click reset button |
| `uploadFile(path)` | Upload a file |
| `fillDateTime(date, time, dateTime)` | Fill date/time inputs |
| `openGoogleLink()` | Navigate to external link |
| `hoverOverButton()` | Hover over element |
| `fillCommentForm(...)` | Fill comment section |
| `acceptSimpleAlert()` | Handle alert dialog |
| `handleConfirmAlert(accept)` | Handle confirm dialog |
| `submitPromptAlert(value)` | Handle prompt dialog |

---

## Extending the Examples

To add your own test based on these examples:

1. Create new test file: `tests/mytest.spec.ts`
2. Import AutomationPracticePage: `import { AutomationPracticePage } from './page-objects/automationPracticePage';`
3. Initialize page object: `const practicePage = new AutomationPracticePage(page);`
4. Use test steps: `await test.step('description', async () => { ... })`
5. Add assertions: `expect(element).toHaveValue('expected');`

---

## Troubleshooting

### Tests Timing Out
- Increase timeout: `--timeout=120000` (in ms)
- Check network connectivity
- Verify element selectors in page object

### Dialog Not Appearing
- Ensure correct function name (showAlert, showConfirm, showPrompt)
- Check dialog handler is registered before click
- Use `page.once('dialog')` instead of `waitForEvent`

### File Upload Fails
- Verify file path is correct and file exists
- Use absolute path if relative path doesn't work
- Check file permissions

### Element Not Found
- Verify selector in page object is correct
- Use `--headed` mode to see what's happening
- Add wait conditions before assertions

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Allure Documentation](https://docs.qameta.io/allure/)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

## Summary

These examples provide a solid foundation for:
- Learning Playwright automation
- Understanding Page Object Model patterns
- Implementing Allure reporting
- Following test automation best practices
- Building scalable test suites

Use these as templates for your own test automation needs!
