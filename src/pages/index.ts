import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { InventoryPage } from './InventoryPage';
import { LoginPage } from './LoginPage';

/**
 * Page object registry. Every entry is automatically exposed as a test fixture
 * under its key, e.g. `async ({ loginPage }) => ...`.
 *
 * To add a page: create the class, then add one line here. Nothing else to wire up.
 */
export const pageObjects = {
  loginPage: LoginPage,
  inventoryPage: InventoryPage,
  cartPage: CartPage,
  checkoutPage: CheckoutPage,
} as const;

export { BasePage } from './BasePage';
export { CartPage, CheckoutPage, InventoryPage, LoginPage };
