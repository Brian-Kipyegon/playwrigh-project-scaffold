import { expect, type Page } from '@playwright/test';

/**
 * Common behaviour for every page object.
 * Page objects expose intent-revealing actions and locators; they do not contain assertions
 * about business rules. Those belong in the tests.
 */
export abstract class BasePage {
  /** Path relative to baseURL, e.g. `/inventory.html`. */
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${escapeRegExp(this.path)}$`));
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
