import { eslintConfig as wekaConfig } from './plugins/eslint/index.js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['vite.config.ts', 'vitest.config.ts']
  },
  ...wekaConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    files: ['**/*.stories.*'],
    rules: {
      'import/no-anonymous-default-export': 'off'
    }
  },
  {
    files: ['**/icons/**/*.tsx'],
    rules: {
      'max-len': 'off'
    }
  }
)
