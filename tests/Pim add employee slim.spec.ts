import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { PimAddEmployeePage } from './pages/PimAddEmployeePage';

// Covers test-cases/pim-add-employee-slim-testcases.csv (TC-001, TC-002)

test.describe('PIM - Add Employee SLIM Test Suite', () => {
  let addEmployeePage: PimAddEmployeePage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.waitForLoginButtonReady();
    await loginPage.login('Admin', 'admin123');
    await loginPage.waitForPageLoad();

    addEmployeePage = new PimAddEmployeePage(page);
    await addEmployeePage.navigateToAddEmployee();
  });

  test('[TC-001]: Create employee with required names', async () => {
    // Steps: enter First Name 'Ava', Last Name 'Stone', click Save
    await addEmployeePage.fillRequiredNames('Ava', 'Stone');
    await addEmployeePage.clickSave();

    // Expected: employee record is created (header shows the new Employee Id)
    const employeeIdHeader = await addEmployeePage.getCreatedEmployeeIdFromHeader();
    expect(employeeIdHeader.length).toBeGreaterThan(0);
  });

  test('[TC-002]: Block save when required name is missing', async () => {
    // Steps: enter First Name 'Ava', leave Last Name blank, click Save
    await addEmployeePage.fillFirstName('Ava');
    await addEmployeePage.clickSave();

    // Expected: required field validation is shown for Last Name
    const validationMessage = await addEmployeePage.getFirstValidationMessage();
    expect(validationMessage.length).toBeGreaterThan(0);
  });
});