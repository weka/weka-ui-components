export const DEFAULT_CONSTS_PATH = 'utils/consts'

export function buildImportFix(fixer, sourceCode, constantName, constsPath) {
  const imports = sourceCode.ast.body.filter(
    (n) => n.type === 'ImportDeclaration'
  )
  const alreadyImported = imports.some(
    (n) =>
      n.source.value === constsPath &&
      n.importKind !== 'type' &&
      n.specifiers.some(
        (s) => s.local.name === constantName && s.importKind !== 'type'
      )
  )
  if (alreadyImported) {
    return null
  }
  const existingConstsImport = imports.find(
    (n) =>
      n.source.value === constsPath &&
      n.importKind !== 'type' &&
      n.specifiers.some((s) => s.type === 'ImportSpecifier')
  )
  if (existingConstsImport) {
    const namedSpecifiers = existingConstsImport.specifiers.filter(
      (s) => s.type === 'ImportSpecifier'
    )
    const lastSpecifier = namedSpecifiers[namedSpecifiers.length - 1]
    return fixer.insertTextAfter(lastSpecifier, `, ${constantName}`)
  }
  const lastImport = imports[imports.length - 1]
  const importStatement = `import { ${constantName} } from '${constsPath}'`
  if (lastImport) {
    return fixer.insertTextAfter(lastImport, `\n${importStatement}`)
  }
  return fixer.insertTextBefore(sourceCode.ast.body[0], `${importStatement}\n`)
}

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
      const constsPath =
        context.settings?.weka?.constsPath ?? DEFAULT_CONSTS_PATH
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
              message: `Use ${constantName} from '${constsPath}' instead of the literal ${JSON.stringify(
                value
              )}.`,
              fix: (fixer) => {
                const isJsxAttributeValue =
                  parent?.type === 'JSXAttribute' && parent.value === node
                const replacement = isJsxAttributeValue
                  ? `{${constantName}}`
                  : constantName
                const fixes = [fixer.replaceText(node, replacement)]
                const importFix = buildImportFix(
                  fixer,
                  context.sourceCode,
                  constantName,
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
}
