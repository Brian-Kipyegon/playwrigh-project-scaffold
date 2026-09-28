import { expect, test } from '@fixtures/ui.fixtures';
import { lockedOutUser, standardUser } from '@data/users';

test.describe('Login', () => {
  // These tests exercise the login form itself, so start logged out.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(standardUser.username, standardUser.password);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.login(lockedOutUser.username, lockedOutUser.password);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });
});
