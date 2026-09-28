import fs from 'node:fs';
import { test as setup, expect } from '@playwright/test';
import { LoginResponseSchema } from '@api/schemas';
import { env } from '@config/env';
import { API_TOKEN_FILE } from '@config/paths';

/**
 * Suite-level "beforeAll" for API tests. Runs once per `npm run test:api`,
 * then every API worker reuses the token instead of logging in again.
 */
setup('authenticate API user', async ({ request }) => {
  const response = await request.post('/auth/login', {
    data: { username: env.API_USERNAME, password: env.API_PASSWORD, expiresInMins: 60 },
  });
  await expect(response, 'API login should succeed').toBeOK();

  const { accessToken } = LoginResponseSchema.parse(await response.json());
  fs.writeFileSync(API_TOKEN_FILE, JSON.stringify({ accessToken }));
});
