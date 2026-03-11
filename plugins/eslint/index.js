import { fixupPluginRules } from '@eslint/compat'
import js from '@eslint/js'
import wekaPlugin from '@weka/eslint-plugin-weka'
import eslintConfigPrettier from 'eslint-config-prettier'
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

export const eslintConfig = tseslint.config(
  {
    extends: [js.configs.recommended, eslintConfigPrettier],
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node
    }
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      sonarjs.configs.recommended,
      eslintConfigPrettier
    ],
    files: ['**/*.{ts,tsx,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs', '*.js']
        },
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      promise,
      'unused-imports': unusedImports,
      '@weka/weka': wekaPlugin,
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
      ...reactHooks.configs.recommended.rules,
      'no-trailing-spaces': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^node:'],
            ['^react', '^@?\\w'],
            [
              '^(utils|hooks|components|types|context|static|consts|svgs)(/.*|$)'
            ],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.(css|scss)$']
          ]
        }
      ],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase']
        }
      ],
      '@typescript-eslint/return-await': ['warn', 'in-try-catch'],
      '@typescript-eslint/require-await': 'off',
      '@weka/weka/no-empty-strings': 'error',
      'no-debugger': 'warn',
      'no-param-reassign': 'off',
      'no-unused-expressions': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'no-use-before-define': 'off',
      'no-unused-vars': 'off',
      'no-bitwise': 'off',
      'no-plusplus': 'error',
      'no-console': 'warn',
      'no-useless-rename': 'warn',
      'no-return-await': 'off',
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
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CatchClause > Identifier[name!="error"]',
          message: 'Catch parameter must be named "error"'
        },
        {
          selector:
            'JSXAttribute[name.name="style"] > JSXExpressionContainer > ObjectExpression > Property:not([key.name=/^--/]) > Literal.value',
          message:
            'Avoid using static inline styles. Use CSS classes instead. Only dynamic values with template literals (e.g., `${value}px`) or CSS custom properties (--variable-name) are allowed in style prop.'
        },
        {
          selector: 'TSQualifiedName[left.name="React"]',
          message:
            'Do not use React.* for types — import types directly (e.g., import { type KeyboardEvent } from "react")'
        },
        {
          selector:
            'JSXAttribute[name.name="className"] > JSXExpressionContainer > TemplateLiteral',
          message:
            'Use clsx() for conditional classNames instead of template literals'
        },
        {
          selector:
            'JSXAttribute[name.name="className"] > JSXExpressionContainer > BinaryExpression[operator="+"]',
          message:
            'Use clsx() for combining classNames instead of string concatenation'
        },
        {
          selector:
            'ExpressionStatement > CallExpression[callee.name="useCallback"]',
          message:
            'useCallback result is not assigned to a variable. This is dead code — the memoized callback is created but never used.'
        },
        {
          selector:
            'ExpressionStatement > CallExpression[callee.name="useMemo"]',
          message:
            'useMemo result is not assigned to a variable. This is dead code — the memoized value is created but never used.'
        }
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'React',
          message:
            'Do not use React.* — import members directly (e.g., useMemo, FC, etc.)'
        }
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['default'],
              message:
                'Use named imports from react (e.g., import { useMemo } from "react")'
            }
          ]
        }
      ],
      curly: 'warn',
      'max-params': ['error', 4],
      'arrow-body-style': ['error', 'as-needed'],
      'require-await': 'error',
      'prefer-promise-reject-errors': 'warn',
      'import/no-dynamic-require': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: true, packageDir: './' }
      ],
      'import/no-named-as-default': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
      ],
      'promise/always-return': 'warn',
      'promise/catch-or-return': 'error',
      'promise/no-nesting': 'warn',
      'promise/prefer-await-to-then': 'error',
      'promise/prefer-await-to-callbacks': 'warn',
      'react/jsx-no-bind': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
      ],
      'react/forbid-prop-types': 'off',
      'react/no-did-mount-set-state': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/no-danger': 'warn',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never', propElementValues: 'always' }
      ],
      'react/prefer-stateless-function': 'error',
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/jsx-pascal-case': 'error',
      'react/destructuring-assignment': [
        'error',
        'always',
        { destructureInSignature: 'always' }
      ],
      'react/forward-ref-uses-ref': 'error',
      'react/jsx-closing-tag-location': ['error', 'tag-aligned'],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration' }
      ],
      'react/hook-use-state': ['error', { allowDestructuredState: true }],
      'react/jsx-fragments': 'error',
      'react/prop-types': 'off',
      'react/jsx-key': ['error', { warnOnDuplicates: true }],
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-props-no-spread-multi': 'error',
      'react/jsx-sort-props': [
        'error',
        { multiline: 'last', reservedFirst: true }
      ],
      'react/no-multi-comp': 'error',
      'react/no-namespace': 'error',
      'react/no-object-type-as-default-prop': 'error',
      'react/no-this-in-sfc': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/self-closing-comp': 'error',
      'react/void-dom-elements-no-children': 'error',
      'react/jsx-newline': ['error', { prevent: true }],
      'jsx-a11y/no-autofocus': 'off',
      'jsx-a11y/role-support-aria-props': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/label-has-for': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
      'sonarjs/sql-queries': 'off',
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
      'sonarjs/todo-tag': 'warn'
    }
  },
  {
    files: ['**/consts.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', format: ['UPPER_CASE'], modifiers: ['const'] }
      ]
    }
  },
  {
    files: ['**/*Context*.tsx', '**/*context*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off'
    }
  }
)
