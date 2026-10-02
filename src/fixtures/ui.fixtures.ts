import { test as base, expect } from '@playwright/test';
import { CartPage, CheckoutPage, InventoryPage, LoginPage } from '@pages/index';

type UiFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** Auto fixture: wraps every UI test like a global beforeEach/afterEach hook. */
  browserErrorCollector: void;
};

export const test = base.extend<UiFixtures>({
  // Each test gets fresh page objects bound to its own `page`.
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  browserErrorCollector: [
    async ({ page }, use, testInfo) => {
      // ---- before each test ----
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
      });

      await use();

      // ---- after each test ----
      if (errors.length > 0 && testInfo.status !== testInfo.expectedStatus) {
        await testInfo.attach('browser-errors', { body: errors.join('\n'), contentType: 'text/plain' });
      }
    },
    { auto: true },
  ],
});

export { expect };
