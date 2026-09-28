import { expect, test } from '@fixtures/ui.fixtures';
import { Products } from '@data/products';

test.describe('Cart', () => {
  test('added products appear in the cart with the badge count', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(Products.backpack, Products.bikeLight);

    await expect(inventoryPage.header.cartBadge).toHaveText('2');

    await inventoryPage.header.openCart();
    await cartPage.expectLoaded();
    await expect(cartPage.itemNames).toHaveText([Products.backpack, Products.bikeLight]);
  });
});
