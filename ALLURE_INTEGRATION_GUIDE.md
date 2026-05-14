# Allure Report Integration with Playwright - Step by Step Guide

## Overview
This guide walks through integrating Allure Report with Playwright test automation framework for detailed test execution reporting and analytics.

---

## Step 1: Install Dependencies

Install the required Allure packages:

```bash
npm install -D allure-playwright allure-commandline
```

**What this installs:**
- `allure-playwright`: Reporter adapter for Playwright to generate Allure results
- `allure-commandline`: CLI tool to generate and serve Allure reports

---

## Step 2: Update Playwright Configuration

Edit `playwright.config.ts` and add Allure reporter to the reporter array:

```typescript
export default defineConfig({
  // ... other config ...
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['allure-playwright']],
  
  // ... rest of config ...
});
```

**Key points:**
- Keep the HTML reporter for traditional Playwright reports
- Add `['allure-playwright']` for Allure result generation
- Both reporters run simultaneously, no performance impact

---

## Step 3: Add NPM Scripts

Update `package.json` with convenient commands:

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:allure": "npx playwright test",
    "allure:generate": "npx allure generate allure-results --clean -o allure-report",
    "allure:open": "npx allure open allure-report",
    "allure:serve": "npx allure serve allure-results"
  }
}
```

**Script purposes:**
- `test`: Standard Playwright test execution
- `test:allure`: Same as test, but with Allure reporting enabled
- `allure:generate`: Generate static HTML report from results
- `allure:open`: Open generated report in browser
- `allure:serve`: Serve live Allure results (real-time updates)

---

## Step 4: Run Tests and Generate Report

### Execute tests with Allure reporting:

```bash
npm run test:allure
```

This creates:
- `allure-results/` folder with raw test data
- `playwright-report/` folder with HTML report

### Generate the Allure HTML report:

```bash
npm run allure:generate
```

Output: `allure-report/` folder with static HTML pages

### View the report:

```bash
npm run allure:open
```

Opens the report in your default browser at `http://127.0.0.1:<port>`

Or serve live results:

```bash
npm run allure:serve
```

---

## Step 5: Configure GitHub Actions (CI/CD)

Update `.github/workflows/playwright.yml`:

```yaml
- name: Run Playwright tests
  run: npx playwright test

- name: Generate Allure report
  if: always()
  run: npx allure generate allure-results --clean -o allure-report

- name: Upload Playwright report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30

- name: Upload Allure report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: allure-report
    path: allure-report/
    retention-days: 30
```

**What this does:**
1. Runs all Playwright tests
2. Generates Allure report from results
3. Uploads both Playwright and Allure reports as artifacts
4. Uses `if: always()` so reports are generated even if tests fail
5. Retains artifacts for 30 days

---

## Step 6: Accessing Reports in CI

After a GitHub Actions run completes:

1. Go to the workflow run page
2. Scroll to **Artifacts** section
3. Download `allure-report` or `playwright-report` zip
4. Extract and open `index.html` in a browser

---

## Allure Report Features

Once integrated, you can access:

### Overview Dashboard
- Total test count and pass rate
- Duration and timeline
- Duration graph

### Categories
- Organize tests by categories (features, modules, etc.)
- View pass/fail distribution per category

### Suites
- Test execution structure
- Individual test details
- Failure reasons and traces

### Behaviors
- BDD-style test organization (Given/When/Then)
- Feature and scenario grouping

### Packages
- Package/module-level test organization
- Hierarchical test structure

### Graphs
- Historical trends
- Failure analysis
- Duration trends

### Timeline
- Chronological test execution view
- Identify bottlenecks

---

## Optional: Add Test Descriptions for Better Reports

Enhance Playwright tests with Allure annotations:

```typescript
import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

test('should login successfully', async ({ page }) => {
  await allure.description('Verify user can log in with valid credentials');
  await allure.label('feature', 'Authentication');
  await allure.label('severity', 'critical');
  
  await page.goto('https://example.com/login');
  // test code...
});
```

---

## Troubleshooting

### Report not generating
- Check `allure-results/` folder exists after test run
- Verify `allure-commandline` is installed: `npx allure --version`
- Clear old results: `npm run allure:generate` includes `--clean` flag

### Port already in use
- Change port: `npx allure serve allure-results --port 8080`
- Or kill existing process using the port

### Missing test details
- Ensure tests are properly structured with describe/test blocks
- Add allure annotations for richer metadata

---

## File Structure After Integration

```
TestAutomation/
├── allure-report/              # Generated Allure HTML report
│   ├── index.html
│   ├── history/
│   └── ...
├── allure-results/             # Raw Allure test data
│   ├── *.json
│   └── ...
├── playwright-report/          # Playwright HTML report
│   ├── index.html
│   └── ...
├── tests/
│   ├── page-objects/
│   ├── automationPractice.spec.ts
│   └── automationPracticeAlerts.spec.ts
├── .github/workflows/
│   └── playwright.yml
├── playwright.config.ts        # Updated with allure-playwright
├── package.json                # Updated with scripts
└── node_modules/
```

---

## Quick Command Reference

| Command | Purpose |
|---------|---------|
| `npm run test:allure` | Run tests with Allure reporting |
| `npm run allure:generate` | Generate static HTML report |
| `npm run allure:open` | Open report in browser |
| `npm run allure:serve` | Serve live results |
| `npm test` | Standard Playwright test run |

---

## Summary

You now have:
✅ Allure reporting integrated with Playwright  
✅ Local report generation and viewing  
✅ GitHub Actions CI/CD pipeline publishing reports  
✅ Rich test analytics and visualization  
✅ Historical trend tracking capability  

For more details, visit:
- [Allure Documentation](https://docs.qameta.io/allure/)
- [allure-playwright](https://github.com/allure-framework/allure-js/tree/master/packages/allure-playwright)
