import { test, expect, Page } from '@playwright/test';
import { AdminUserManagementPage } from './pages/AdminUserManagementPage';
import dotenv from 'dotenv';

dotenv.config();


function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const BASE_URL = getRequiredEnv('ORANGEHRM_BASE_URL').replace(/\/web\/index\.php\/auth\/login\/?$/, '');
const ADMIN_USERNAME = getRequiredEnv('ORANGEHRM_USERNAME');
const ADMIN_PASSWORD = getRequiredEnv('ORANGEHRM_PASSWORD');
const NON_ADMIN_USERNAME = process.env.NON_ADMIN_USERNAME ?? 'fiona';
const NON_ADMIN_PASSWORD = process.env.NON_ADMIN_PASSWORD ?? 'OfficePassword@123';

// Helper function for login
async function loginAsAdmin(page: Page) {
  await page.goto(`${BASE_URL}/web/index.php/auth/login`);
  await page.getByPlaceholder('Username').fill(ADMIN_USERNAME);
  await page.getByPlaceholder('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(`${BASE_URL}/**/*`, { timeout: 10000 });
}

async function loginAsNonAdmin(page: Page) {
  await page.goto(`${BASE_URL}/web/index.php/auth/login`);
  await page.getByPlaceholder('Username').fill(NON_ADMIN_USERNAME);
  await page.getByPlaceholder('Password').fill(NON_ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(`${BASE_URL}/**/*`, { timeout: 10000 });
}

test('[TC-004]: Non-Admin user cannot access Add User screen', async ({ page }) => {
  await loginAsNonAdmin(page);
  const adminUserMgmt = new AdminUserManagementPage(page);

  // Try to access Add User screen
  const isAccessible = await adminUserMgmt.isAddUserScreenAccessible();
  
  // Verify screen is not accessible or permission denied is shown
  if (isAccessible) {
    const permissionDenied = await adminUserMgmt.isPermissionDeniedDisplayed();
    expect(permissionDenied).toBeTruthy();
  } else {
    expect(isAccessible).toBeFalsy();
  }
});

test('[TC-005]: Empty required fields validation', async ({ page }) => {
  await loginAsAdmin(page);
  const adminUserMgmt = new AdminUserManagementPage(page);

  // Navigate to Add User screen
  await adminUserMgmt.navigateToAddUser();
  await page.waitForTimeout(1000);

  // Try to save without filling any fields
  await adminUserMgmt.clickSave();
  await page.waitForTimeout(1500);

  // Verify validation errors appear
  const errorMsg = await adminUserMgmt.getErrorMessage();
  expect(errorMsg.length).toBeGreaterThan(0);
});
