import { Locator, Page } from '@playwright/test';

export class PimAddEmployeePage {
  constructor(private page: Page) {}

  private fieldGroupByLabel(label: string): Locator {
    return this.page.locator('div.oxd-input-group', { hasText: label }).first();
  }

  private inputByLabel(label: string): Locator {
    return this.fieldGroupByLabel(label).locator('input').first();
  }

  private get firstNameInput(): Locator {
    return this.page.locator('input[name="firstName"]').first();
  }

  private get middleNameInput(): Locator {
    return this.page.locator('input[name="middleName"]').first();
  }

  private get lastNameInput(): Locator {
    return this.page.locator('input[name="lastName"]').first();
  }

  private get employeeIdInput(): Locator {
    return this.page.locator('form input.oxd-input').nth(4);
  }

  private get photoUploadInput(): Locator {
    return this.page.locator('input[type="file"]').first();
  }

  private get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }

  private get cancelButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  private get requiredMessage(): Locator {
    return this.page.locator('span.oxd-input-field-error-message');
  }

  private get toastMessage(): Locator {
    return this.page.locator('.oxd-toast-content, .oxd-alert-content-text').first();
  }

  private get employeeIdLabelInHeader(): Locator {
    return this.page.locator('h6.oxd-text').filter({ hasText: 'Employee Id' }).first();
  }

  async navigateToAddEmployee(): Promise<void> {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee');
  }

  async fillFirstName(value: string): Promise<void> {
    await this.firstNameInput.fill(value);
  }

  async fillMiddleName(value: string): Promise<void> {
    await this.middleNameInput.fill(value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.lastNameInput.fill(value);
  }

  async fillRequiredNames(firstName: string, lastName: string): Promise<void> {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
  }

  async clearEmployeeId(): Promise<void> {
    await this.employeeIdInput.fill('');
  }

  async fillEmployeeId(value: string): Promise<void> {
    await this.employeeIdInput.fill(value);
  }

  async getEmployeeIdValue(): Promise<string> {
    return (await this.employeeIdInput.inputValue()).trim();
  }

  async uploadPhoto(filePath: string): Promise<void> {
    await this.photoUploadInput.setInputFiles(filePath);
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async createEmployeeWithRequiredNames(firstName: string, lastName: string): Promise<void> {
    await this.fillRequiredNames(firstName, lastName);
    await this.clickSave();
  }

  async getFirstValidationMessage(): Promise<string> {
    const msg = await this.requiredMessage.first().textContent();
    return (msg ?? '').trim();
  }

  async getAllValidationMessages(): Promise<string[]> {
    const messages = await this.requiredMessage.allTextContents();
    return messages.map((m) => m.trim()).filter(Boolean);
  }

  async getToastMessage(): Promise<string> {
    try {
      await this.toastMessage.waitFor({ state: 'visible', timeout: 4000 });
      return (await this.toastMessage.textContent())?.trim() ?? '';
    } catch {
      return '';
    }
  }

  async getCreatedEmployeeIdFromHeader(): Promise<string> {
    try {
      const text = (await this.employeeIdLabelInHeader.textContent())?.trim() ?? '';
      return text;
    } catch {
      return '';
    }
  }

  async getFieldValueByLabel(label: string): Promise<string> {
    const input = this.inputByLabel(label);
    return (await input.inputValue()).trim();
  }
}
