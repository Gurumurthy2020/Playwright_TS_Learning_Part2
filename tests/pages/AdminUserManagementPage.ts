import { Page } from '@playwright/test';

export class AdminUserManagementPage {
  constructor(private page: Page) {}

  private fieldGroupByLabel(label: string) {
    return this.page
      .locator('div.oxd-input-group', { hasText: label })
      .first();
  }

  private dropdownByLabel(label: string) {
    return this.fieldGroupByLabel(label)
      .locator('div.oxd-select-text')
      .first();
  }

  private inputByLabel(label: string) {
    return this.fieldGroupByLabel(label)
      .locator('input')
      .first();
  }

  // Locators - using getters for lazy initialization
  private get adminMenuButton() {
    return this.page.getByRole('link', { name: 'Admin' });
  }

  private get userManagementMenu() {
    return this.page.getByRole('menuitem', { name: 'User Management' });
  }

  private get addButton() {
    return this.page.getByRole('button', { name: 'Add' });
  }

  private get userRoleDropdown() {
    return this.dropdownByLabel('User Role');
  }

  private get employeeNameInput() {
    return this.page.locator('input[placeholder="Type for hints..."]').first();
  }

  private get statusDropdown() {
    return this.dropdownByLabel('Status');
  }

  private get usernameInput() {
    return this.inputByLabel('Username');
  }

  private get passwordInput() {
    return this.inputByLabel('Password');
  }

  private get confirmPasswordInput() {
    return this.inputByLabel('Confirm Password');
  }

  private get saveButton() {
    return this.page.getByRole('button', { name: 'Save' });
  }

  private get cancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  // Error and Success Messages
  private get errorMessage() {
    return this.page.locator('.oxd-input-field-error-message, .oxd-alert-content-text');
  }

  private get successMessage() {
    return this.page.getByText(/Successfully Saved|User successfully added/i);
  }

  private get duplicateUsernameError() {
    return this.page.getByText(/already exists/i);
  }

  // Navigation Methods
  async navigateToAdminUserManagement() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
  }

  async navigateToAddUser() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveSystemUser');
  }

  // Action Methods
  async selectUserRole(roleName: string) {
    await this.userRoleDropdown.click();
    await this.page.getByRole('option', { name: roleName }).click();
  }

  async fillEmployeeName(employeeName: string) {
    await this.employeeNameInput.fill(employeeName);
    // Wait for dropdown options to appear and select first option
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option').first().click();
  }

  async selectStatus(status: string) {
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async fillUsername(username: string) {
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.fill(password);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  // Verification Methods
  async isAddUserScreenDisplayed(): Promise<boolean> {
    const heading = this.page.getByRole('heading', { name: /Add User|Add System User/i });
    return await heading.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    try {
      await this.errorMessage.first().waitFor({ state: 'visible', timeout: 3000 });
      const messages = await this.errorMessage.allTextContents();
      return messages.join(' ').trim();
    } catch {
      return '';
    }
  }

  async getDuplicateUsernameErrorMessage(): Promise<string> {
    try {
      await this.duplicateUsernameError.waitFor({ state: 'visible', timeout: 3000 });
      return await this.duplicateUsernameError.textContent() || '';
    } catch {
      return '';
    }
  }

  async isSuccessMessageDisplayed(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isUserCreatedInList(username: string): Promise<boolean> {
    try {
      // Navigate to User Management list
      await this.navigateToAdminUserManagement();
      await this.page.waitForTimeout(1000);
      const userRow = this.page.getByText(username);
      return await userRow.isVisible({ timeout: 3000 });
    } catch {
      return false;
    }
  }

  async isAddUserScreenAccessible(): Promise<boolean> {
    try {
      await this.navigateToAddUser();
      await this.page.waitForTimeout(500);
      return await this.isAddUserScreenDisplayed();
    } catch {
      return false;
    }
  }

  async isPermissionDeniedDisplayed(): Promise<boolean> {
    const permissionText = this.page.getByText(/Access Denied|You are not allowed|Permission denied/i);
    try {
      return await permissionText.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async getFieldValidationError(fieldLabel: string): Promise<string> {
    try {
      const field = this.page.locator(`span:has-text("${fieldLabel}") ~ div.oxd-input-field-error`);
      await field.waitFor({ state: 'visible', timeout: 3000 });
      return await field.textContent() || '';
    } catch {
      // Alternative: Try to get error message near the field
      const errorSpan = this.page.locator('span.oxd-input-field-error-message');
      try {
        return await errorSpan.first().textContent() || '';
      } catch {
        return '';
      }
    }
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}
