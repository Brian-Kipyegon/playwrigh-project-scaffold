import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

/**
 * Single source of truth for runtime configuration.
 * Validated once at import time so a misconfigured run fails fast with a clear message
 * instead of producing confusing test failures later.
 */
const envSchema = z.object({
  UI_BASE_URL: z.url().default('https://www.saucedemo.com'),
  UI_USERNAME: z.string().min(1),
  UI_PASSWORD: z.string().min(1),

  API_BASE_URL: z.url().default('https://dummyjson.com'),
  API_USERNAME: z.string().min(1),
  API_PASSWORD: z.string().min(1),

  CI: z.stringbool().default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Invalid environment configuration (see .env.example):\n${issues}`);
}

export const env = parsed.data;
