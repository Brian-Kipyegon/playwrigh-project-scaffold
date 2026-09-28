import { test as setup, expect } from '@fixtures/ui.fixtures';
import { UI_STORAGE_STATE } from '@config/paths';
import { standardUser } from '@data/users';

/**
 * Suite-level "beforeAll" for UI tests. Logs in once through the real UI and saves
 * cookies/localStorage, so every UI test starts already authenticated.
 */
setup('authenticate UI user', async ({ page, loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(standardUser.username, standardUser.password);
  await inventoryPage.expectLoaded();
  await expect(inventoryPage.title).toBeVisible();

  await page.context().storageState({ path: UI_STORAGE_STATE });
});
