import path from 'node:path';

const ROOT = path.resolve(__dirname, '..', '..');

export const AUTH_DIR = path.join(ROOT, '.auth');
/** Browser storage state produced by the `ui-setup` project and reused by every UI test. */
export const UI_STORAGE_STATE = path.join(AUTH_DIR, 'ui-user.json');
/** Bearer token produced by the `api-setup` project and reused by every API test. */
export const API_TOKEN_FILE = path.join(AUTH_DIR, 'api-token.json');
