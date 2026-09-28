import type { APIRequestContext } from '@playwright/test';

/**
 * API clients wrap a Playwright APIRequestContext (which already carries baseURL,
 * headers and auth) and expose one method per endpoint.
 *
 * Methods return the raw APIResponse so tests stay in control of assertions
 * (status, headers, body) - including negative cases.
 */
export abstract class BaseApiClient {
  constructor(protected readonly request: APIRequestContext) {}
}
