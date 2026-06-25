import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve, join } from 'path'
import { renameSync } from 'fs'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

import pkg from './package.json' with { type: 'json' }

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const v1ExternalPatterns: (string | RegExp)[] = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-router-dom',
  'react-toastify',
  '@emotion/react',
  '@emotion/styled',
  /^@mui\/material/,
  'luxon',
  'clsx'
]

const v2DeclaredDeps = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {})
]

const v2ExternalPatterns: RegExp[] = v2DeclaredDeps.map(
  (name) => new RegExp(`^${escapeRegex(name)}(\\/|$)`)
)

function matchesAny(
  source: string,
  patterns: (string | RegExp)[]
): boolean {
  return patterns.some((pattern) =>
    typeof pattern === 'string' ? pattern === source : pattern.test(source)
  )
}

function isExternalImport(source: string, importer: string | undefined) {
  if (!importer) {
    return false
  }
  const isFromV2 = importer.replace(/\\/g, '/').includes('/lib/v2/')
  return isFromV2
    ? matchesAny(source, v2ExternalPatterns)
    : matchesAny(source, v1ExternalPatterns)
}

/**
 * Renames `.module.css` assets to `.css` in the build output so that consuming
 * bundlers don't drop or re-process them — the class names are already hashed.
 *
 * Splits the work across two hooks because Vite 8 / Rolldown ignores bundle
 * mutations in `generateBundle`. Chunk code is still rewritten in
 * `generateBundle` (so the injected `import` statements point at `.css`), and
 * the actual asset files are renamed on disk in `writeBundle` after Rolldown
 * has finished emitting them.
 */
function stripCssModuleExtension(): Plugin {
  const moduleCssFiles: string[] = []

  return {
    name: 'strip-css-module-extension',
    enforce: 'post',
    generateBundle(_, bundle) {
      moduleCssFiles.length = 0
      for (const fileName of Object.keys(bundle)) {
        if (fileName.endsWith('.module.css')) {
          moduleCssFiles.push(fileName)
        }
      }

      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk' && chunk.code.includes('.module.css')) {
          chunk.code = chunk.code.split('.module.css').join('.css')
        }
      }
    },
    writeBundle(options) {
      const outDir = options.dir
      if (!outDir) {
        return
      }
      for (const fileName of moduleCssFiles) {
        const newFileName = fileName.replace('.module.css', '.css')
        renameSync(join(outDir, fileName), join(outDir, newFileName))
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({ include: ['lib'] }),
    svgr({ svgrOptions: { ref: true } }),
    tsconfigPaths(),
    stripCssModuleExtension()
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
      external: isExternalImport,
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
