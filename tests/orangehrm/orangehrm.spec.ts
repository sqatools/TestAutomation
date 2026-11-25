import { expect, test } from '@playwright/test';
import {
  OrangeHrmAdminPage,
  OrangeHrmApplicationPage,
  OrangeHrmBuzzPage,
  OrangeHrmDirectoryPage,
  OrangeHrmLeavePage,
  OrangeHrmLoginPage,
  OrangeHrmPimPage,
  OrangeHrmRecruitmentPage,
} from '../../pages/orangeHrmPages';

const demoCredentials = { username: 'Admin', password: 'admin123' };

async function loginAsAdmin(page: import('@playwright/test').Page) {
  const loginPage = new OrangeHrmLoginPage(page);
  await loginPage.goto();
  await loginPage.login(demoCredentials.username, demoCredentials.password);
  await expect(page).toHaveURL(/\/dashboard\/index$/);
}

test.describe('OrangeHRM public demo UI', { tag: '@orangehrm' }, () => {
  test('admin can log in and reach the dashboard', async ({ page }) => {
    await loginAsAdmin(page);

    const application = new OrangeHrmApplicationPage(page);
    await expect(application.moduleHeading).toHaveText('Dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('username is required', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await loginPage.goto();
    await loginPage.passwordInput.fill(demoCredentials.password);
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(loginPage.validationErrors).toContainText(['Required']);
  });

  test('password is required', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await loginPage.goto();
    await loginPage.usernameInput.fill(demoCredentials.username);
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(loginPage.validationErrors).toContainText(['Required']);
  });

  test('invalid credentials are rejected', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalid-user', 'invalid-password');

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(loginPage.alertMessage).toContainText('Invalid credentials');
  });

  test('forgot-password opens the reset request page', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);
    await loginPage.goto();
    await loginPage.requestPasswordReset();

    await expect(page).toHaveURL(/\/auth\/requestPasswordResetCode$/);
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('logout ends the session and protects a deep link', async ({ page }) => {
    await loginAsAdmin(page);
    await new OrangeHrmApplicationPage(page).logout();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
    await expect(page).toHaveURL(/\/auth\/login$/);
  });

  test('dashboard shows its core widgets and shortcuts', async ({ page }) => {
    await loginAsAdmin(page);

    await expect(page.getByText('Time at Work', { exact: true })).toBeVisible();
    await expect(page.getByText('My Actions', { exact: true })).toBeVisible();
    await expect(page.getByText('Quick Launch', { exact: true })).toBeVisible();
    await expect(page.getByText('Buzz Latest Posts', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Assign Leave' })).toBeVisible();
  });

  test('side navigation opens every primary module', async ({ page }) => {
    await loginAsAdmin(page);

    const application = new OrangeHrmApplicationPage(page);
    const modules = [
      ['Admin', /\/admin\/viewSystemUsers$/],
      ['PIM', /\/pim\/viewEmployeeList$/],
      ['Leave', /\/leave\/viewLeaveList$/],
      ['Time', /\/time\/viewEmployeeTimesheet$/],
      ['Recruitment', /\/recruitment\/viewCandidates$/],
      ['My Info', /\/pim\/viewPersonalDetails\/empNumber\/\d+$/],
      ['Performance', /\/performance\/searchEvaluatePerformanceReview$/],
      ['Dashboard', /\/dashboard\/index$/],
      ['Directory', /\/directory\/viewDirectory$/],
      ['Claim', /\/claim\/viewAssignClaim$/],
      ['Buzz', /\/buzz\/viewBuzz$/],
      ['Maintenance', /\/maintenance\/purgeEmployee$/],
    ] as const;

    for (const [name, url] of modules) {
      await application.openModule(name);
      await expect(page).toHaveURL(url);
    }
  });

  test('Admin system users page displays search controls and user records', async ({ page }) => {
    await loginAsAdmin(page);
    const adminPage = new OrangeHrmAdminPage(page);
    await adminPage.openRoute('admin/viewSystemUsers');

    await expect(adminPage.systemUsersHeading).toBeVisible();
    await expect(adminPage.searchButton).toBeVisible();
    await expect(adminPage.resetButton).toBeVisible();
    await expect(adminPage.tableRows.first()).toBeVisible();
    await expect(adminPage.addButton).toBeVisible();
  });

  test('Admin system-user filters accept a username and reset cleanly', async ({ page }) => {
    await loginAsAdmin(page);
    const adminPage = new OrangeHrmAdminPage(page);
    await adminPage.openRoute('admin/viewSystemUsers');

    await page.locator('.oxd-form .oxd-input').first().fill(demoCredentials.username);
    await adminPage.searchButton.click();
    await expect(adminPage.tableRows).toHaveCount(1);
    await expect(adminPage.tableRows.first()).toContainText('Admin');
    await adminPage.resetButton.click();
    await expect(page.locator('.oxd-form .oxd-input').first()).toHaveValue('');
  });

  test('PIM employee list shows filters, records, and pagination', async ({ page }) => {
    await loginAsAdmin(page);
    const pimPage = new OrangeHrmPimPage(page);
    await pimPage.openRoute('pim/viewEmployeeList');

    await expect(pimPage.employeeHeading).toBeVisible();
    await expect(pimPage.searchButton).toBeVisible();
    await expect(pimPage.resetButton).toBeVisible();
    await expect(pimPage.tableRows.first()).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Pagination Navigation' })).toBeVisible();
  });

  test('PIM add-employee page exposes required name fields and can be cancelled', async ({ page }) => {
    await loginAsAdmin(page);
    const pimPage = new OrangeHrmPimPage(page);
    await pimPage.openRoute('pim/addEmployee');

    await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();
    await expect(pimPage.firstNameInput).toBeVisible();
    await expect(pimPage.lastNameInput).toBeVisible();
    await expect(page.getByText('Employee Full Name', { exact: false })).toBeVisible();
    await pimPage.cancelButton.click();
    await expect(page).toHaveURL(/\/pim\/viewEmployeeList$/);
  });

  test('Leave assignment form exposes employee, leave type, and date inputs', async ({ page }) => {
    await loginAsAdmin(page);
    const leavePage = new OrangeHrmLeavePage(page);
    await leavePage.openRoute('leave/assignLeave');

    await expect(page.getByRole('heading', { name: 'Assign Leave' })).toBeVisible();
    await expect(leavePage.employeeNameInput).toBeVisible();
    await expect(leavePage.dateInputs).toHaveCount(2);
    await expect(leavePage.assignButton).toBeVisible();
    await expect(page.locator('.oxd-select-text').first()).toBeVisible();
  });

  test('Leave list supports filters and reset', async ({ page }) => {
    await loginAsAdmin(page);
    const leavePage = new OrangeHrmLeavePage(page);
    await leavePage.openRoute('leave/viewLeaveList');

    await expect(page.getByRole('heading', { name: 'Leave List' })).toBeVisible();
    await expect(leavePage.searchButton).toBeVisible();
    await expect(leavePage.resetButton).toBeVisible();
  });

  test('Leave type configuration form exposes its controls', async ({ page }) => {
    await loginAsAdmin(page);
    const leavePage = new OrangeHrmLeavePage(page);
    await leavePage.openRoute('leave/defineLeaveType');

    await expect(page.getByRole('heading', { name: 'Add Leave Type' })).toBeVisible();
    await expect(page.locator('form input').last()).toBeVisible();
    await expect(page.getByRole('radio')).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
  });

  test('Time module opens the employee timesheet workflow', async ({ page }) => {
    await loginAsAdmin(page);
    const application = new OrangeHrmApplicationPage(page);
    await application.openRoute('time/viewEmployeeTimesheet');

    await expect(application.moduleHeading).toHaveText('Time');
    await expect(page.getByRole('heading', { name: 'Timesheets Pending Action' })).toBeVisible();
  });

  test('Recruitment candidates page displays filters and results table', async ({ page }) => {
    await loginAsAdmin(page);
    const recruitmentPage = new OrangeHrmRecruitmentPage(page);
    await recruitmentPage.openRoute('recruitment/viewCandidates');

    await expect(page.getByRole('heading', { name: 'Candidates' })).toBeVisible();
    await expect(recruitmentPage.searchButton).toBeVisible();
    await expect(recruitmentPage.resetButton).toBeVisible();
    await expect(recruitmentPage.tableRows.first()).toBeVisible();
  });

  test('Recruitment candidate form validates required fields without creating a record', async ({ page }) => {
    await loginAsAdmin(page);
    const recruitmentPage = new OrangeHrmRecruitmentPage(page);
    await recruitmentPage.openRoute('recruitment/addCandidate');

    await expect(page.getByRole('heading', { name: 'Add Candidate' })).toBeVisible();
    await recruitmentPage.saveButton.click();
    await expect(recruitmentPage.formErrors).toHaveCount(3);
    await expect(recruitmentPage.formErrors).toContainText(['Required', 'Required', 'Required']);
    await expect(page).toHaveURL(/\/recruitment\/addCandidate$/);
  });

  test('Recruitment vacancy page supports vacancy search', async ({ page }) => {
    await loginAsAdmin(page);
    const application = new OrangeHrmApplicationPage(page);
    await application.openRoute('recruitment/viewJobVacancy');

    await expect(page.getByRole('heading', { name: 'Vacancies' })).toBeVisible();
    await expect(application.searchButton).toBeVisible();
    await expect(application.resetButton).toBeVisible();
  });

  test('My Info shows personal details and profile tabs', async ({ page }) => {
    await loginAsAdmin(page);
    const application = new OrangeHrmApplicationPage(page);
    await application.openRoute('pim/viewMyDetails');

    await expect(application.moduleHeading).toHaveText('PIM');
    await expect(page.getByRole('tab', { name: 'Personal Details' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Contact Details' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Emergency Contacts' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Dependents' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Immigration' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Job' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Salary' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Report-to' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Qualifications' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Memberships' })).toBeVisible();
  });

  test('My Info profile tabs navigate to contact and job details', async ({ page }) => {
    await loginAsAdmin(page);
    const application = new OrangeHrmApplicationPage(page);
    await application.openRoute('pim/viewMyDetails');

    await page.getByRole('tab', { name: 'Contact Details' }).click();
    await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();
    await page.getByRole('tab', { name: 'Job' }).click();
    await expect(page.getByRole('heading', { name: 'Job Details' })).toBeVisible();
  });

  test('Performance module exposes review and configuration views', async ({ page }) => {
    await loginAsAdmin(page);
    const application = new OrangeHrmApplicationPage(page);
    await application.openRoute('performance/searchEvaluatePerformanceReview');

    await expect(application.moduleHeading).toHaveText('Performance');
    await expect(page.getByRole('heading', { name: 'Employee Reviews' })).toBeVisible();
    await expect(application.searchButton).toBeVisible();
  });

  test('Directory displays employee cards and search controls', async ({ page }) => {
    await loginAsAdmin(page);
    const directoryPage = new OrangeHrmDirectoryPage(page);
    await directoryPage.openRoute('directory/viewDirectory');

    await expect(directoryPage.moduleHeading).toHaveText('Directory');
    await expect(directoryPage.searchButton).toBeVisible();
    await expect(directoryPage.resetButton).toBeVisible();
    await expect(directoryPage.employeeCards.first()).toBeVisible();
  });

  test('Maintenance module requires an explicit maintenance session', async ({ page }) => {
    await loginAsAdmin(page);
    const application = new OrangeHrmApplicationPage(page);
    await application.openRoute('maintenance/viewMaintenanceModule');

    await expect(page.getByRole('heading', { name: 'Administrator Access' })).toBeVisible();
    await expect(application.passwordField).toBeVisible();
  });

  test('Claim module shows its main navigation and current claims view', async ({ page }) => {
    await loginAsAdmin(page);
    const application = new OrangeHrmApplicationPage(page);
    await application.openRoute('claim/viewClaimModule');

    await expect(application.moduleHeading).toHaveText('Claim');
    await expect(page.getByRole('navigation', { name: 'Topbar Menu' })).toBeVisible();
  });

  test('Buzz feed displays the post composer without submitting data', async ({ page }) => {
    await loginAsAdmin(page);
    const buzzPage = new OrangeHrmBuzzPage(page);
    await buzzPage.openRoute('buzz/viewBuzz');

    await expect(buzzPage.moduleHeading).toHaveText('Buzz');
    await expect(buzzPage.postTextArea).toBeVisible();
    await expect(buzzPage.shareButton).toBeVisible();
  });
});
