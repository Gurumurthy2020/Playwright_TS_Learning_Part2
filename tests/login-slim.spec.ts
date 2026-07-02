import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('OrangeHRM Login - SLIM Test Suite (AC1)', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.waitForLoginButtonReady();
  });

  // ==================== POSITIVE CASES ====================

  test('[TC-001]: Valid login redirects to Dashboard', async ({ page }) => {
    // Covers AC: Given valid username and password, when user clicks Login, then redirected to Dashboard
    
    // Act
    await loginPage.login('Admin', 'admin123');
    await loginPage.waitForPageLoad();

    // Assert
    const isDashboardVisible = await loginPage.isDashboardVisible();
    expect(isDashboardVisible).toBeTruthy();
    expect(page.url()).not.toContain('login');
  });

  test('[TC-004]: Password field masks input characters', async () => {
    // Covers AC: The password field must mask input characters at all times
    
    // Act
    await loginPage.fillPassword('test123');

    // Assert
    const isPasswordMasked = await loginPage.isPasswordMasked();
    expect(isPasswordMasked).toBeTruthy();
    
    const fieldType = await loginPage.getPasswordFieldType();
    expect(fieldType).toBe('password');
  });

  // ==================== CRITICAL NEGATIVE CASES ====================

  test('[TC-002]: Invalid credentials display error', async ({ page }) => {
    // Covers AC: Given incorrect username or password, error message "Invalid credentials" is displayed
    
    // Act
    await loginPage.login('InvalidUser', 'wrongpass');
    await page.waitForTimeout(1000);

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage?.toLowerCase()).toContain('invalid');

    const isOnLoginPage = await loginPage.isOnLoginPage();
    expect(isOnLoginPage).toBeTruthy();

    const isDashboardVisible = await loginPage.isDashboardVisible();
    expect(isDashboardVisible).toBeFalsy();
  });
});
