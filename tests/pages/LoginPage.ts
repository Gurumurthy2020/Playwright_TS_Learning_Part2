import { Locator, Page, expect } from '@playwright/test';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToLoginPage() {
    await this.page.goto('/web/index.php/auth/login');
    console.log('Navigated to URL:', this.page.url());
  }

  async fillUsername(username: string) {
    await this.page.getByPlaceholder('Username').fill(username);
  }

  async fillPassword(password: string) {
    await this.page.getByPlaceholder('Password').fill(password);
  }

  async clickLogin() {
    await this.page.getByRole('button', { name: /login/i }).click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForLoginButtonReady() {
    // Wait for page to fully load
    await this.page.waitForLoadState('networkidle');
    // Wait for the input fields to be visible
    await this.page.getByPlaceholder('Username').waitFor({ state: 'visible' });
    await this.page.getByPlaceholder('Password').waitFor({ state: 'visible' });
    // Wait for button to be enabled
    const loginBtn = this.page.getByRole('button', { name: /login/i });
    await expect(loginBtn).toBeEnabled();
    console.log('Login button is ready and enabled');
  }


  async isDashboardVisible(): Promise<boolean> {
    try {
      return await this.page.getByRole('heading', { name: /dashboard/i }).isVisible();
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string | null> {
    try {
      return await this.page.locator('.oxd-alert-content').textContent();
    } catch {
      return null;
    }
  }

  async isPasswordMasked(): Promise<boolean> {
    try {
      const fieldType = await this.page.getByPlaceholder('Password').getAttribute('type');
      return fieldType === 'password';
    } catch {
      return false;
    }
  }

  async getPasswordFieldType(): Promise<string | null> {
    try {
      return await this.page.getByPlaceholder('Password').getAttribute('type');
    } catch {
      return null;
    }
  }

  async isUsernameErrorDisplayed(): Promise<boolean> {
    try {
      return await this.page.locator('input[name="username"]').evaluate((el: HTMLInputElement) => {
        return el.validationMessage !== '';
      });
    } catch {
      return false;
    }
  }

  async isPasswordErrorDisplayed(): Promise<boolean> {
    try {
      return await this.page.locator('input[name="password"]').evaluate((el: HTMLInputElement) => {
        return el.validationMessage !== '';
      });
    } catch {
      return false;
    }
  }

  async isErrorDisplayed(): Promise<boolean> {
    try {
      return await this.page.locator('.oxd-form-row-error').isVisible();
    } catch {
      return false;
    }
  }

  async isOnLoginPage(): Promise<boolean> {
    return this.page.url().includes('login');
  }
}

