import { env } from '@config/env';

export interface UiUser {
  username: string;
  password: string;
}

/** Primary user comes from env so it can differ per environment. */
export const standardUser: UiUser = { username: env.UI_USERNAME, password: env.UI_PASSWORD };

/** SauceDemo's built-in accounts for negative scenarios. */
export const lockedOutUser: UiUser = { username: 'locked_out_user', password: env.UI_PASSWORD };
