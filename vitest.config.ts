import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['lib/**/*.test.{ts,tsx}'],
    globals: true,
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      include: ['lib/v2/**/*.{ts,tsx}'],
      exclude: [
        'lib/v2/**/*.test.{ts,tsx}',
        'lib/v2/**/*.stories.{ts,tsx}',
        'lib/v2/**/index.ts'
      ],
      thresholds: {
        branches: 70,
        lines: 80,
        functions: 80,
        statements: 80
      }
    }
  }
})
