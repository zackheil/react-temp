import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    dir: './src',
    coverage: {
      provider: 'c8',
      exclude: ['**/*.spec.ts', '**/*.test.ts', '**/test/*.*', '**/test/*.stories.tsx'],
    },
    globals: true,
    environment: 'jsdom',
    alias: {
      '@utils/testing': path.resolve(__dirname, './src/.meta-utils/test.ts'),
      '@utils/stories': path.resolve(__dirname, './src/.meta-utils/stories.ts'),
    },
  },
});
