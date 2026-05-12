export function stringLiteralRule(value, constantName) {
  return {
    meta: {
      type: 'suggestion',
      docs: {
        description: `Enforce using ${constantName} constant instead of the literal ${JSON.stringify(
          value
        )}`,
        recommended: true
      },
      fixable: 'code',
      schema: []
    },
    create(context) {
      return {
        Literal(node) {
          const { parent } = node
          const isObjectKey =
            parent?.type === 'Property' &&
            parent.key === node &&
            !parent.computed
          if (node.value === value && !isObjectKey) {
            context.report({
              node,
              message: `Use ${constantName} from 'consts' instead of the literal ${JSON.stringify(
                value
              )}.`,
              fix: (fixer) => {
                const isJsxAttributeValue =
                  parent?.type === 'JSXAttribute' && parent.value === node
                const replacement = isJsxAttributeValue
                  ? `{${constantName}}`
                  : constantName
                return fixer.replaceText(node, replacement)
              }
            })
          }
        }
      }
    }
  }
}
