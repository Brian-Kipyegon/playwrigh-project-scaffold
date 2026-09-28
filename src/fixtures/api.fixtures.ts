import fs from 'node:fs';
import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { AuthClient } from '@api/AuthClient';
import { ProductsClient } from '@api/ProductsClient';
import { API_TOKEN_FILE } from '@config/paths';

type ApiWorkerFixtures = {
  /** Read once per worker from the file written by the `api-setup` project. */
  accessToken: string;
};

type ApiFixtures = {
  /** Request context with the bearer token applied. Disposed after each test. */
  authedRequest: APIRequestContext;
  authClient: AuthClient;
  productsClient: ProductsClient;
  /** Auto fixture: wraps every API test like a global beforeEach/afterEach hook. */
  apiTimer: void;
};

export const test = base.extend<ApiFixtures, ApiWorkerFixtures>({
  accessToken: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      if (!fs.existsSync(API_TOKEN_FILE)) {
        throw new Error(`Missing ${API_TOKEN_FILE}. Run "npm run test:api" so the api-setup project runs first.`);
      }
      const { accessToken } = JSON.parse(fs.readFileSync(API_TOKEN_FILE, 'utf-8')) as { accessToken: string };
      await use(accessToken);
    },
    { scope: 'worker' },
  ],

  authedRequest: async ({ playwright, accessToken }, use, testInfo) => {
    const { baseURL, extraHTTPHeaders } = testInfo.project.use;
    const context = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: { ...extraHTTPHeaders, Authorization: `Bearer ${accessToken}` },
    });
    await use(context);
    await context.dispose();
  },

  authClient: async ({ authedRequest }, use) => {
    await use(new AuthClient(authedRequest));
  },
  productsClient: async ({ authedRequest }, use) => {
    await use(new ProductsClient(authedRequest));
  },

  apiTimer: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use, testInfo) => {
      const start = performance.now();
      await use();
      testInfo.annotations.push({ type: 'duration', description: `${Math.round(performance.now() - start)} ms` });
    },
    { auto: true },
  ],
});

export { expect };
