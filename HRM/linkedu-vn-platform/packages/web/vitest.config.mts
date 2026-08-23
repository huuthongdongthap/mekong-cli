import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: false,
    passWithNoTests: true,
    // Playwright e2e specs live in tests/e2e and are run by `test:e2e`,
    // not by vitest.
    exclude: ['**/node_modules/**', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/validations/**', 'src/lib/api-client.ts', 'src/middleware/**'],
      exclude: ['src/lib/__tests__/**', 'src/middleware/__tests__/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
