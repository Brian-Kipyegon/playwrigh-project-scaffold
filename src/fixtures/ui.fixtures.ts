import { test as base, expect } from '@playwright/test';
import { pageObjects } from '@pages/index';
import { createPageObjectFixtures, type PageObjectFixtures } from './page-object.fixtures';

type UiFixtures = PageObjectFixtures<typeof pageObjects> & {
  /** Auto fixture: wraps every UI test like a global beforeEach/afterEach hook. */
  browserErrorCollector: void;
};

export const test = base.extend<UiFixtures>({
  // Every page object in the registry is injected automatically.
  ...createPageObjectFixtures(pageObjects),

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
