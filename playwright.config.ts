import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';
import { UI_STORAGE_STATE } from './src/config/paths';

/**
 * Two independent suites live side by side:
 *
 *   npm run test:api  ->  api-setup  -> api
 *   npm run test:ui   ->  ui-setup   -> ui-chromium
 *
 * Selecting a project with --project automatically runs its `dependencies`
 * (the setup project), so each suite authenticates only for itself.
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: './src/hooks/global-setup.ts',
  globalTeardown: './src/hooks/global-teardown.ts',

  fullyParallel: true,
  forbidOnly: env.CI,
  retries: env.CI ? 2 : 0,
  workers: env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // ---------------- API ----------------
    {
      name: 'api-setup',
      testDir: './tests/setup',
      testMatch: /api\.setup\.ts/,
      use: { baseURL: env.API_BASE_URL },
    },
    {
      name: 'api',
      testDir: './tests/api',
      dependencies: ['api-setup'],
      use: {
        baseURL: env.API_BASE_URL,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },

    // ---------------- UI ----------------
    {
      name: 'ui-setup',
      testDir: './tests/setup',
      testMatch: /ui\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: env.UI_BASE_URL, testIdAttribute: 'data-test' },
    },
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      dependencies: ['ui-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.UI_BASE_URL,
        storageState: UI_STORAGE_STATE,
        // SauceDemo exposes `data-test` attributes, so getByTestId() maps to them.
        testIdAttribute: 'data-test',
      },
    },
  ],
});
