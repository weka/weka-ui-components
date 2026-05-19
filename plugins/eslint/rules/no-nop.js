import { buildImportFix, DEFAULT_CONSTS_PATH } from './utils.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce using NOP constant instead of empty arrow functions () => {}',
      recommended: true
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    const constsPath = context.settings?.weka?.constsPath ?? DEFAULT_CONSTS_PATH
    return {
      ArrowFunctionExpression(node) {
        const isSingleLine = node.loc.start.line === node.loc.end.line
        if (
          node.body.type === 'BlockStatement' &&
          node.body.body.length === 0 &&
          node.params.length === 0 &&
          isSingleLine
        ) {
          context.report({
            node,
            message: `Use NOP from '${constsPath}' instead of an empty arrow function.`,
            fix: (fixer) => {
              const fixes = [fixer.replaceText(node, 'NOP')]
              const importFix = buildImportFix(
                fixer,
                context.sourceCode,
                'NOP',
                constsPath
              )
              if (importFix) {
                fixes.push(importFix)
              }
              return fixes
            }
          })
        }
      }
    }
  }
}
