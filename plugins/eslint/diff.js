import diff from 'eslint-plugin-diff'

/**
 * Wraps an ESLint flat config so it lints only the lines that differ from
 * ESLINT_PLUGIN_DIFF_COMMIT (defaults to HEAD). Used for CI diff linting:
 *
 *   // eslint.diff.config.mjs
 *   import { withDiff } from '@weka/weka-ui-components/eslint-diff'
 *   import baseConfig from './eslint.config.js'
 *   export default withDiff(baseConfig)
 */
export function withDiff(config) {
  return [...config, { plugins: { diff }, processor: diff.processors.diff }]
}
