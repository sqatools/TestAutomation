import type { Locator, Page } from '@playwright/test';

const orangeHrmUrl = 'https://opensource-demo.orangehrmlive.com';

export class OrangeHrmLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly alertMessage: Locator;
  readonly validationErrors: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.alertMessage = page.locator('.oxd-alert-content-text');
    this.validationErrors = page.locator('.oxd-input-field-error-message');
  }

  async goto() {
    await this.page.goto(`${orangeHrmUrl}/web/index.php/auth/login`);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async requestPasswordReset() {
    await this.page.getByText('Forgot your password?', { exact: true }).click();
  }
}

export class OrangeHrmApplicationPage {
  readonly page: Page;
  readonly moduleHeading: Locator;
  readonly sideNavigation: Locator;
  readonly tableRows: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly formErrors: Locator;
  readonly passwordField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.moduleHeading = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.sideNavigation = page.getByRole('navigation', { name: 'Sidepanel' });
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });
    this.formErrors = page.locator('.oxd-input-field-error-message');
    this.passwordField = page.locator('input[type="password"]');
  }

  async openModule(name: string) {
    await this.sideNavigation.getByRole('link', { name, exact: true }).click();
  }

  async openRoute(route: string) {
    await this.page.goto(`${orangeHrmUrl}/web/index.php/${route}`);
  }

  async logout() {
    await this.page.locator('.oxd-userdropdown-tab').click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
  }
}

export class OrangeHrmAdminPage extends OrangeHrmApplicationPage {
  readonly addButton: Locator;
  readonly systemUsersHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.addButton = page.getByRole('button', { name: 'Add', exact: false });
    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
  }
}

export class OrangeHrmPimPage extends OrangeHrmApplicationPage {
  readonly employeeHeading: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeHeading = page.getByRole('heading', { name: 'Employee Information' });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.middleNameInput = page.getByPlaceholder('Middle Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  }
}

export class OrangeHrmLeavePage extends OrangeHrmApplicationPage {
  readonly employeeNameInput: Locator;
  readonly dateInputs: Locator;
  readonly assignButton: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeNameInput = page.getByPlaceholder('Type for hints...');
    this.dateInputs = page.getByPlaceholder('yyyy-dd-mm');
    this.assignButton = page.getByRole('button', { name: 'Assign', exact: true });
  }
}

export class OrangeHrmRecruitmentPage extends OrangeHrmApplicationPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.emailInput = page.getByPlaceholder('Type here').first();
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
  }
}

export class OrangeHrmDirectoryPage extends OrangeHrmApplicationPage {
  readonly employeeCards: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeCards = page.locator('.orangehrm-directory-card');
    this.searchInput = page.getByPlaceholder('Type for hints...');
  }
}

export class OrangeHrmBuzzPage extends OrangeHrmApplicationPage {
  readonly postTextArea: Locator;
  readonly shareButton: Locator;
  readonly posts: Locator;

  constructor(page: Page) {
    super(page);
    this.postTextArea = page.getByPlaceholder('What\'s on your mind?');
    this.shareButton = page.getByRole('button', { name: 'Post', exact: true });
    this.posts = page.locator('.orangehrm-buzz-post');
  }
}
