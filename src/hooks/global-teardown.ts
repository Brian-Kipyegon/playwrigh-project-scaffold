import fs from 'node:fs';
import { env } from '../config/env';
import { AUTH_DIR } from '../config/paths';

/**
 * Runs ONCE after all projects finish (even if tests failed).
 */
export default async function globalTeardown(): Promise<void> {
  // Don't leave session tokens lying around on shared CI agents.
  if (env.CI) {
    fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  }

  const startedAt = process.env.RUN_STARTED_AT;
  const seconds = startedAt ? ((Date.now() - Date.parse(startedAt)) / 1000).toFixed(1) : '?';
  console.log(`\n=== Test run finished in ${seconds}s ===\n`);
}
