// @ts-ignore

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    dir: './src',
    globals: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, './src/.meta-utils/test-setup.ts')],
    alias: {
      '@utils/testing': resolve(__dirname, './src/.meta-utils/test.ts'),
      '@utils/stories': resolve(__dirname, './src/.meta-utils/stories.ts'),
    },
    exclude: [resolve(__dirname, './src/.meta-utils/test.ts')],
  },
  resolve: {
    mainFields: ['module', 'main'],
  },
});
