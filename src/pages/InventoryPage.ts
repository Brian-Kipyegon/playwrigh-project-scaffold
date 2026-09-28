import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async addToCart(...names: string[]): Promise<void> {
    for (const name of names) {
      await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
    }
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  /** Reads the currently displayed prices as numbers, in display order. */
  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map((t) => Number(t.replace('$', '')));
  }
}
