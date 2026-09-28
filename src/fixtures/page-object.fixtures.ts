import type { Fixtures, Page, PlaywrightTestArgs, PlaywrightTestOptions } from '@playwright/test';

/** Anything constructed from a Playwright `page`: pages, components, etc. */
export type PageObjectClass = new (page: Page) => object;

export type PageObjectRegistry = Record<string, PageObjectClass>;

/** Maps `{ loginPage: typeof LoginPage }` to `{ loginPage: LoginPage }`. */
export type PageObjectFixtures<R extends PageObjectRegistry> = {
  [K in keyof R]: InstanceType<R[K]>;
};

/**
 * Turns a registry of page object classes into Playwright fixtures.
 *
 * - Lazy: a page object is only constructed if the test (or another fixture) asks for it.
 * - Isolated: each test gets new instances bound to its own `page`.
 * - Fully typed: fixture names and types are inferred from the registry.
 */
export function createPageObjectFixtures<R extends PageObjectRegistry>(
  registry: R,
): Fixtures<PageObjectFixtures<R>, object, PlaywrightTestArgs & PlaywrightTestOptions> {
  const fixtures: Record<string, unknown> = {};

  for (const [name, PageObject] of Object.entries(registry)) {
    // Playwright reads the destructured `{ page }` to resolve dependencies, so keep this shape.
    fixtures[name] = async ({ page }: { page: Page }, use: (instance: object) => Promise<void>) => {
      await use(new PageObject(page));
    };
  }

  return fixtures as Fixtures<PageObjectFixtures<R>, object, PlaywrightTestArgs & PlaywrightTestOptions>;
}
