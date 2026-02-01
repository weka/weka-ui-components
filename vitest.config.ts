import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

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
    }
  }
})
