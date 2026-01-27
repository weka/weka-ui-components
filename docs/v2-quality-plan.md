# Plan: Enhance v2 Quality Infrastructure

## Goal
Bring weka-ui-components v2 quality tooling to match observe/frontend's setup.

---

## What is Flat Config?

ESLint 8.21+ introduced a new configuration format called "flat config" (`eslint.config.mjs`) that replaces the legacy `.eslintrc` format. Benefits:
- More predictable configuration merging
- Native ES modules support
- File-based overrides without complex cascading
- observe/frontend already uses this format

---

## Implementation Steps

### 1. Add Dependencies

**File:** `package.json` (add to devDependencies)

```json
"@eslint/compat": "^1.2.6",
"@eslint/js": "^9.27.0",
"eslint-config-prettier": "^10.1.0",
"eslint-plugin-diff": "^2.0.3",
"eslint-plugin-import": "^2.31.0",
"eslint-plugin-jsx-a11y": "^6.10.2",
"eslint-plugin-promise": "^7.2.1",
"eslint-plugin-react": "^7.37.5",
"eslint-plugin-react-hooks": "^5.2.0",
"eslint-plugin-react-refresh": "^0.4.20",
"eslint-plugin-simple-import-sort": "^12.1.1",
"eslint-plugin-sonarjs": "^3.0.2",
"eslint-plugin-unused-imports": "^4.1.4",
"globals": "^16.1.0",
"typescript-eslint": "^8.28.0",
"stylelint": "^16.2.1",
"stylelint-config-standard-scss": "^13.0.0",
"@vitest/coverage-v8": "^4.0.18"
```

Run: `yarn add -D <packages>`

### 2. Create ESLint Flat Config (copied from observe)

**File:** `eslint.config.mjs` (new) - full config copied from observe/frontend

```javascript
import { fixupPluginRules } from '@eslint/compat'
import js from '@eslint/js'
import wekaLint from '@weka/eslint-plugin-weka'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import promise from 'eslint-plugin-promise'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import sonarjs from 'eslint-plugin-sonarjs'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'storybook-static',
      'node_modules',
      '**/*.md',
      '**/*.test.*',
      '**/*.spec.*',
      '**/*.stories.*'
    ]
  },
  // JS/MJS config files - no type checking
  {
    extends: [js.configs.recommended, eslintConfigPrettier],
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node
    }
  },
  // TypeScript/TSX files - with type checking
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      sonarjs.configs.recommended,
      eslintConfigPrettier
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs', '*.js']
        },
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      promise,
      'unused-imports': unusedImports,
      '@weka/weka': wekaLint,
      import: fixupPluginRules(importPlugin),
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      react: { version: 'detect' }
    },
    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Import sorting (observe groups)
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^node:'],
            ['^react', '^@?\\w'],
            ['^(utils|hooks|components|types|context|static|consts|svgs)(/.*|$)'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.(css|scss)$']
          ]
        }
      ],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',

      // React rules (all from observe)
      'react/jsx-no-bind': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/forbid-prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/no-danger': 'warn',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never', propElementValues: 'always' }],
      'react/prefer-stateless-function': 'error',
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/jsx-pascal-case': 'error',
      'react/destructuring-assignment': ['error', 'always', { destructureInSignature: 'always' }],
      'react/forward-ref-uses-ref': 'error',
      'react/jsx-closing-tag-location': ['error', 'tag-aligned'],
      'react/function-component-definition': ['error', { namedComponents: 'function-declaration' }],
      'react/hook-use-state': ['error', { allowDestructuredState: true }],
      'react/jsx-fragments': 'error',
      'react/prop-types': 'off',
      'react/jsx-key': ['error', { warnOnDuplicates: true }],
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-props-no-spread-multi': 'error',
      'react/jsx-sort-props': ['error', { multiline: 'last', reservedFirst: true }],
      'react/no-multi-comp': 'error',
      'react/no-namespace': 'error',
      'react/no-object-type-as-default-prop': 'error',
      'react/no-this-in-sfc': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/self-closing-comp': 'error',
      'react/void-dom-elements-no-children': 'error',
      'react/jsx-newline': ['error', { prevent: true }],

      // SonarJS (complexity rules from observe)
      'sonarjs/void-use': 'off',
      'sonarjs/argument-type': 'off',
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/unused-import': 'off',
      'sonarjs/no-dead-store': 'off',
      'sonarjs/array-constructor': 'error',
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/cyclomatic-complexity': ['error', { threshold: 10 }],
      'sonarjs/destructuring-assignment-syntax': 'error',
      'sonarjs/different-types-comparison': 'off',
      'sonarjs/elseif-without-else': 'error',
      'sonarjs/expression-complexity': ['error', { max: 5 }],
      'sonarjs/file-name-differ-from-class': 'error',
      'sonarjs/function-return-type': 'warn',
      'sonarjs/max-lines': ['error', { maximum: 600 }],
      'sonarjs/max-lines-per-function': ['error', { maximum: 200 }],
      'sonarjs/max-union-size': ['error', { threshold: 4 }],
      'sonarjs/no-nested-switch': 'error',
      'sonarjs/no-nested-incdec': 'error',
      'sonarjs/shorthand-property-grouping': 'warn',
      'sonarjs/prefer-read-only-props': 'error',
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/nested-control-flow': ['warn', { maximumNestingLevel: 4 }],
      'sonarjs/todo-tag': 'warn',

      // General rules
      'no-debugger': 'warn',
      'no-param-reassign': 'off',
      'no-unused-expressions': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'no-use-before-define': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] }
      ],
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
      ],
      'max-params': ['error', 4],
      'no-bitwise': 'off',
      'no-plusplus': 'error',
      curly: 'warn',
      'no-console': 'warn',
      'no-useless-rename': 'warn',
      'arrow-body-style': ['error', 'as-needed'],
      '@weka/weka/no-empty-strings': 'error',
      'require-await': 'error',
      'no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2, 10, 100, 1000],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreNumericLiteralTypes: true,
          ignoreTypeIndexes: true
        }
      ],
      'no-return-await': 'off',
      '@typescript-eslint/return-await': ['warn', 'in-try-catch'],
      '@typescript-eslint/require-await': 'off',
      'prefer-promise-reject-errors': 'warn',
      'promise/always-return': 'warn',
      'promise/catch-or-return': 'error',
      'promise/no-nesting': 'warn',
      'promise/prefer-await-to-then': 'error',
      'promise/prefer-await-to-callbacks': 'warn',

      // Accessibility (relaxed like observe)
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/role-support-aria-props': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/label-has-for': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',

      // Import
      'import/no-named-as-default': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true, packageDir: './' }],

      // No-restricted patterns (from observe)
      'no-restricted-syntax': [
        'error',
        { selector: 'CatchClause > Identifier[name!="error"]', message: 'Catch parameter must be named "error"' },
        { selector: 'JSXAttribute[name.name="className"] > JSXExpressionContainer > TemplateLiteral', message: 'Use clsx() for conditional classNames instead of template literals' },
        { selector: 'JSXAttribute[name.name="className"] > JSXExpressionContainer > BinaryExpression[operator="+"]', message: 'Use clsx() for combining classNames instead of string concatenation' },
        { selector: 'ExpressionStatement > CallExpression[callee.name="useCallback"]', message: 'useCallback result is not assigned to a variable. This is dead code.' },
        { selector: 'ExpressionStatement > CallExpression[callee.name="useMemo"]', message: 'useMemo result is not assigned to a variable. This is dead code.' }
      ],
      'no-restricted-imports': [
        'error',
        { paths: [{ name: 'react', importNames: ['default'], message: 'Use named imports from react' }] }
      ]
    }
  },
  // Context files - allow multiple exports
  {
    files: ['**/*Context*.tsx', '**/*context*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' }
  },
  // Consts files - UPPER_CASE only
  {
    files: ['**/consts.ts'],
    rules: {
      '@typescript-eslint/naming-convention': ['error', { selector: 'variable', format: ['UPPER_CASE'], modifiers: ['const'] }]
    }
  }
)
```

**Delete:** `.eslintrc` (legacy config)

### 3. Create Diff-based ESLint Config for CI

**File:** `eslint.diff.config.mjs` (new)

```javascript
import diff from 'eslint-plugin-diff'
import baseConfig from './eslint.config.mjs'

export default [
  ...baseConfig,
  {
    plugins: { diff },
    rules: { 'diff/diff': 'error' }
  }
]
```

### 4. Update Prettier Config (match observe)

**File:** `.prettierrc` (replace)

```json
{
  "semi": false,
  "jsxSingleQuote": true,
  "singleQuote": true,
  "bracketSpacing": true,
  "trailingComma": "none",
  "bracketSameLine": false,
  "printWidth": 100,
  "singleAttributePerLine": true,
  "overrides": [
    {
      "files": ["*.js", "*.jsx", "*.ts", "*.tsx", "*.json", "**/*.test.*"],
      "options": {
        "printWidth": 80
      }
    }
  ]
}
```

### 5. Create Stylelint Config (copied from observe)

**File:** `stylelint.config.mjs` (new)

```javascript
export default {
  extends: 'stylelint-config-standard-scss',
  ignoreFiles: ['**/*.md', '**/*.test.*', '**/*.spec.*'],
  rules: {
    'selector-class-pattern': [
      '^([a-z][a-zA-Z0-9]+)?$',
      { message: 'Classname "%s" should be written in camelCase.', severity: 'warning' }
    ],
    'no-empty-source': null,
    'no-descending-specificity': null,
    'value-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    'selector-pseudo-class-no-unknown': null,
    'declaration-block-no-redundant-longhand-properties': [true, { severity: 'warning' }],
    'font-family-name-quotes': null,
    'value-keyword-case': ['lower', { camelCaseSvgKeywords: true, ignoreProperties: ['composes'] }],
    'color-hex-length': null
  }
}
```

### 6. Update Vitest Config (add coverage)

**File:** `vitest.config.ts` (modify)

Add coverage configuration:
```typescript
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
```

### 7. Update Package Scripts

**File:** `package.json` (update scripts)

```json
"scripts": {
  "build": "vite build",
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build -c .storybook",

  "typecheck": "tsc --noEmit",
  "lintcheck": "eslint .",
  "lint": "eslint . --fix",
  "lint:diff": "ESLINT_PLUGIN_DIFF_COMMIT=origin/main eslint . --config eslint.diff.config.mjs",
  "lint:diff:fix": "ESLINT_PLUGIN_DIFF_COMMIT=origin/main eslint . --fix --config eslint.diff.config.mjs",
  "formatcheck": "prettier --check .",
  "format": "prettier --write .",
  "stylecheck": "stylelint 'lib/**/*.scss'",
  "stylefix": "stylelint 'lib/**/*.scss' --fix",
  "checkall": "yarn typecheck && yarn lint:diff:fix && yarn stylefix && yarn format",
  "check-ci": "./scripts/local-ci-check.sh"
}
```

### 8. Create Local CI Check Script

**File:** `scripts/local-ci-check.sh` (new)

```bash
#!/bin/bash
set -e

echo "=== Local CI Check ==="
echo ""

echo "1/5 TypeScript check..."
yarn typecheck
echo "    TypeScript: PASSED"

echo ""
echo "2/5 ESLint check..."
yarn lintcheck
echo "    ESLint: PASSED"

echo ""
echo "3/5 Stylelint check..."
yarn stylecheck
echo "    Stylelint: PASSED"

echo ""
echo "4/5 Prettier check..."
yarn formatcheck
echo "    Prettier: PASSED"

echo ""
echo "5/5 Running tests..."
yarn test:run
echo "    Tests: PASSED"

echo ""
echo "=== All checks passed! ==="
```

Make executable: `chmod +x scripts/local-ci-check.sh`

### 9. Create CI Workflow

**File:** `.github/workflows/ci.yml` (new)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint & Format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: corepack enable
      - run: yarn install --immutable

      - name: TypeScript
        run: yarn typecheck

      - name: ESLint (diff for PRs)
        if: github.event_name == 'pull_request'
        run: yarn lint:diff

      - name: ESLint (full for main)
        if: github.event_name == 'push'
        run: yarn lintcheck

      - name: Stylelint
        run: yarn stylecheck

      - name: Prettier
        run: yarn formatcheck

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: corepack enable
      - run: yarn install --immutable
      - run: yarn test:coverage

      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7

      - name: Coverage Report
        if: github.event_name == 'pull_request'
        uses: davelosert/vitest-coverage-report-action@v2
        with:
          json-summary-path: coverage/coverage-summary.json
          json-final-path: coverage/coverage-final.json

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: corepack enable
      - run: yarn install --immutable
      - run: yarn build
```

### 10. Create Ignore Files

**File:** `.prettierignore` (new)
```
dist
node_modules
storybook-static
coverage
*.min.js
*.min.css
yarn.lock
```

**File:** `.eslintignore` (new)
```
dist
node_modules
storybook-static
coverage
```

---

## Files Summary

| File | Action |
|------|--------|
| `package.json` | Modify - add deps + scripts |
| `eslint.config.mjs` | Create |
| `eslint.diff.config.mjs` | Create |
| `.eslintrc` | Delete |
| `.prettierrc` | Replace |
| `stylelint.config.mjs` | Create |
| `vitest.config.ts` | Modify |
| `scripts/local-ci-check.sh` | Create |
| `.github/workflows/ci.yml` | Create |
| `.prettierignore` | Create |
| `.eslintignore` | Create |

---

## Verification

1. `yarn install` - install new dependencies
2. `yarn typecheck` - TypeScript passes
3. `yarn lintcheck` - ESLint passes (may need to fix violations)
4. `yarn stylecheck` - Stylelint passes
5. `yarn formatcheck` - Prettier passes
6. `yarn test:coverage` - tests pass with coverage report
7. `yarn checkall` - all checks pass together
8. Create test PR to verify CI workflow
