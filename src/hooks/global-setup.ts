import fs from 'node:fs';
import type { FullConfig } from '@playwright/test';
import { env } from '../config/env';
import { AUTH_DIR } from '../config/paths';

/**
 * Runs ONCE before any project, for every command (test:api, test:ui, test).
 * Keep it suite-agnostic: things that concern only one suite (like logging in)
 * belong in that suite's setup project instead, so `test:api` never touches the UI.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  // Importing env already validated configuration; fail fast if not.
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  process.env.RUN_STARTED_AT = new Date().toISOString();

  console.log(
    [
      '',
      '=== Test run starting ===',
      `  Playwright : v${config.version}`,
      `  Workers    : ${config.workers}`,
      `  UI target  : ${env.UI_BASE_URL}`,
      `  API target : ${env.API_BASE_URL}`,
      `  CI         : ${env.CI}`,
      '',
    ].join('\n'),
  );
}
