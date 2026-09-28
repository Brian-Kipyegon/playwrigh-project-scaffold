import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'blob-report/', '.auth/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
  },
);
