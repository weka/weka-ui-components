import diff from 'eslint-plugin-diff'

import baseConfig from './eslint.config.mjs'

export default [
  ...baseConfig,
  {
    processor: diff.processors.diff
  }
]
