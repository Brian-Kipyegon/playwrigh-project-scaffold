import type { APIResponse } from '@playwright/test';
import type { NewProduct } from '@data/factories';
import { BaseApiClient } from './BaseApiClient';

export class ProductsClient extends BaseApiClient {
  list(params: { limit?: number; skip?: number } = {}): Promise<APIResponse> {
    return this.request.get('/products', { params });
  }

  search(query: string): Promise<APIResponse> {
    return this.request.get('/products/search', { params: { q: query } });
  }

  create(product: NewProduct): Promise<APIResponse> {
    return this.request.post('/products/add', { data: product });
  }
}
