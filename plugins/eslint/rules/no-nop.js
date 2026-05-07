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
            message:
              "Use NOP from 'consts' instead of an empty arrow function.",
            fix: (fixer) => fixer.replaceText(node, 'NOP')
          })
        }
      }
    }
  }
}
