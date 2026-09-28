import { expect, test } from '@fixtures/api.fixtures';
import { ProductListSchema, ProductSchema } from '@api/schemas';
import { buildProduct } from '@data/factories';

test.describe('Products API', () => {
  test('GET /products honours the limit and skip params', async ({ productsClient }) => {
    const response = await productsClient.list({ limit: 5, skip: 10 });

    await expect(response).toBeOK();
    const body = ProductListSchema.parse(await response.json());
    expect(body.products).toHaveLength(5);
    expect(body.skip).toBe(10);
    expect(body.products[0]?.id).toBe(11);
  });

  test('GET /products/search returns only matching products', async ({ productsClient }) => {
    const query = 'phone';
    const response = await productsClient.search(query);

    await expect(response).toBeOK();
    const { products } = ProductListSchema.parse(await response.json());
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(`${product.title} ${product.description}`.toLowerCase()).toContain(query);
    }
  });

  test('POST /products/add creates a product @smoke', async ({ productsClient }) => {
    const newProduct = buildProduct();

    const response = await productsClient.create(newProduct);

    expect(response.status()).toBe(201);
    const created = ProductSchema.parse(await response.json());
    expect(created).toMatchObject(newProduct);
    expect(created.id).toEqual(expect.any(Number));
  });
});
