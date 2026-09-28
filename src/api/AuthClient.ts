import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';

export class AuthClient extends BaseApiClient {
  login(username: string, password: string, expiresInMins = 30): Promise<APIResponse> {
    return this.request.post('/auth/login', { data: { username, password, expiresInMins } });
  }

  me(): Promise<APIResponse> {
    return this.request.get('/auth/me');
  }
}
