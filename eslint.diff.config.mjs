import diff from 'eslint-plugin-diff'

import baseConfig from './eslint.config.js'

export default [...baseConfig, { plugins: { diff }, processor: diff.processors.diff }]
