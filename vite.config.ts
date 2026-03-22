import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({ include: ['lib'] }),
    svgr({ svgrOptions: { ref: true } }),
    tsconfigPaths()
  ],
  build: {
    lib: {
      // v1 entry (existing) + v2 entry (new)
      entry: {
        main: resolve(__dirname, 'lib/main.ts'),
        'v2/index': resolve(__dirname, 'lib/v2/index.ts')
      },
      formats: ['es']
    },
    copyPublicDir: false,
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-router-dom',
        '@emotion/react',
        '@emotion/styled',
        '@mui/material',
        'luxon',
        'clsx'
      ],
      output: {
        // Preserve module structure for v2 - ensures relative imports work
        preserveModules: true,
        preserveModulesRoot: 'lib',
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
})
