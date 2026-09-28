import { expect, test } from '@fixtures/ui.fixtures';
import { buildCustomer } from '@data/factories';
import { Products } from '@data/products';

test.describe('Checkout', () => {
  test('user can complete a purchase @smoke', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await test.step('add product to cart', async () => {
      await inventoryPage.goto();
      await inventoryPage.addToCart(Products.boltTShirt);
      await inventoryPage.header.openCart();
    });

    await test.step('enter customer details', async () => {
      await cartPage.checkout();
      await checkoutPage.expectLoaded();
      await checkoutPage.fillInformation(buildCustomer());
    });

    await test.step('confirm order', async () => {
      await checkoutPage.finish();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });
  });
});
