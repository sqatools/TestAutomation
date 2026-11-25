import type { Dialog, Locator, Page } from '@playwright/test';

export class AutomationPracticePage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly maleRadio: Locator;
  readonly femaleRadio: Locator;
  readonly otherRadio: Locator;
  readonly javaCheckbox: Locator;
  readonly pythonCheckbox: Locator;
  readonly seleniumCheckbox: Locator;
  readonly countrySelect: Locator;
  readonly normalButton: Locator;
  readonly submitButton: Locator;
  readonly resetButton: Locator;
  readonly simpleAlertButton: Locator;
  readonly confirmAlertButton: Locator;
  readonly promptAlertButton: Locator;
  readonly fileUploadInput: Locator;
  readonly datePicker: Locator;
  readonly timePicker: Locator;
  readonly dateTimePicker: Locator;
  readonly googleLink: Locator;
  readonly iframe: Locator;
  readonly hoverButton: Locator;
  readonly commentTextArea: Locator;
  readonly commentName: Locator;
  readonly commentEmail: Locator;
  readonly commentWebsite: Locator;
  readonly postCommentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.maleRadio = page.locator('#male');
    this.femaleRadio = page.locator('#female');
    this.otherRadio = page.locator('#other');
    this.javaCheckbox = page.locator('#java');
    this.pythonCheckbox = page.locator('#python');
    this.seleniumCheckbox = page.locator('#selenium');
    this.countrySelect = page.locator('#country');
    this.normalButton = page.locator('#normalButton');
    this.submitButton = page.locator('#submitButton');
    this.resetButton = page.locator('#resetButton');
    this.simpleAlertButton = page.locator('button[onclick="showAlert()"]');
    this.confirmAlertButton = page.locator('button[onclick="showConfirm()"]');
    this.promptAlertButton = page.locator('button[onclick="showPrompt()"]');
    this.fileUploadInput = page.locator('#fileUpload');
    this.datePicker = page.locator('#datePicker');
    this.timePicker = page.locator('#timePicker');
    this.dateTimePicker = page.locator('#dateTimePicker');
    this.googleLink = page.locator('#googleLink');
    this.iframe = page.locator('#sampleIframe');
    this.hoverButton = page.locator('#hoverButton');
    this.commentTextArea = page.locator('#comment');
    this.commentName = page.locator('#author');
    this.commentEmail = page.locator('#email');
    this.commentWebsite = page.locator('#url');
    this.postCommentButton = page.locator('#submit');
  }

  async goto() {
    await this.page.goto('https://sqatools.in/automation-practice-page/');
  }

  async fillCredentials(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async chooseGender(gender: 'male' | 'female' | 'other') {
    const radio = gender === 'male' ? this.maleRadio : gender === 'female' ? this.femaleRadio : this.otherRadio;
    await radio.check();
  }

  async toggleSkills(skills: Array<'Java' | 'Python' | 'Selenium'>) {
    const checkboxMap = {
      Java: this.javaCheckbox,
      Python: this.pythonCheckbox,
      Selenium: this.seleniumCheckbox,
    } as const;

    for (const skill of skills) {
      await checkboxMap[skill].check();
    }
  }

  async selectCountry(country: string) {
    await this.countrySelect.selectOption({ label: country });
  }

  async clickNormalButton() {
    await this.normalButton.click();
  }

  async clickSubmitButton() {
    await this.submitButton.click();
  }

  async clickResetButton() {
    await this.resetButton.click();
  }

  async acceptSimpleAlert() {
    let message = '';
    this.page.once('dialog', async (dialog: Dialog) => {
      message = dialog.message();
      await dialog.accept();
    });
    await this.page.evaluate(() => {
      window.showAlert();
    });
    return message;
  }

  async handleConfirmAlert(accept: boolean) {
    let message = '';
    this.page.once('dialog', async (dialog: Dialog) => {
      message = dialog.message();
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
    await this.page.evaluate(() => {
      window.showConfirm();
    });
    return message;
  }

  async submitPromptAlert(value: string) {
    let message = '';
    this.page.once('dialog', async (dialog: Dialog) => {
      message = dialog.message();
      await dialog.accept(value);
    });
    await this.page.evaluate(() => {
      window.showPrompt();
    });
    return message;
  }

  async uploadFile(filePath: string) {
    await this.fileUploadInput.setInputFiles(filePath);
  }

  async fillDateTime(date: string, time: string, dateTime: string) {
    await this.datePicker.fill(date);
    await this.timePicker.fill(time);
    await this.dateTimePicker.fill(dateTime);
  }

  async openGoogleLink() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.googleLink.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  async hoverOverButton() {
    await this.hoverButton.hover();
  }

  async fillCommentForm(comment: string, name: string, email: string, website: string) {
    await this.commentTextArea.fill(comment);
    await this.commentName.fill(name);
    await this.commentEmail.fill(email);
    await this.commentWebsite.fill(website);
  }

  async submitComment() {
    await this.postCommentButton.click();
  }
}
