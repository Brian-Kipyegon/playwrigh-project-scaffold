import { expect, test } from '@fixtures/api.fixtures';
import { ErrorSchema, UserSchema } from '@api/schemas';
import { env } from '@config/env';

test.describe('Auth API', () => {
  test('GET /auth/me returns the authenticated user @smoke', async ({ authClient }) => {
    const response = await authClient.me();

    await expect(response).toBeOK();
    const user = UserSchema.parse(await response.json());
    expect(user.username).toBe(env.API_USERNAME);
  });

  test('POST /auth/login rejects invalid credentials', async ({ authClient }) => {
    const response = await authClient.login(env.API_USERNAME, 'wrong-password');

    expect(response.status()).toBe(400);
    const body = ErrorSchema.parse(await response.json());
    expect(body.message).toBe('Invalid credentials');
  });
});
