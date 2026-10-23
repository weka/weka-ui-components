import { withDiff } from './plugins/eslint/diff.js'

import baseConfig from './eslint.config.js'

export default withDiff(baseConfig)
