import noEmptyContent from './no-empty-content.js'
import noEmptyStrings from './no-empty-strings.js'
import noNop from './no-nop.js'
import preferPackageImports from './prefer-package-imports.js'

export const localRules = {
  'no-empty-strings': noEmptyStrings,
  'no-empty-content': noEmptyContent,
  'no-nop': noNop,
  'prefer-package-imports': preferPackageImports
}
