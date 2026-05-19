import fs from 'node:fs'
import path from 'node:path'

const CODE_EXT_RE = /\.(ts|tsx|js|jsx|mjs|cjs)$/
const REGEX_SPECIAL_CHARS_RE = /[.+?^${}()|[\]\\]/g

function escapeRegex(s) {
  return s.replace(REGEX_SPECIAL_CHARS_RE, '\\$&')
}

function collectStringTargets(value) {
  if (typeof value === 'string') return [value]
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.values(value).flatMap(collectStringTargets)
  }
  return []
}

function buildPatternRegex(absTargetNoExt) {
  const parts = absTargetNoExt.split('*')
  let pattern = '^' + escapeRegex(parts[0])
  for (let i = 1; i < parts.length; i++) {
    pattern += i === 1 ? '(.+?)' : '\\1'
    pattern += escapeRegex(parts[i])
  }
  pattern += '$'
  return new RegExp(pattern)
}

/**
 * Reads `package.json#imports` once and produces a list of normalized targets:
 *   - exact targets:   { alias, withExt, noExt }
 *   - pattern targets: { aliasPattern, regex }
 *
 * Pattern handling follows the Node.js spec: a single `*` capture in the alias
 * key and one or more `*` in the target value, where every `*` on the right
 * receives the same captured substring.
 */
function loadAliasTargets(cwd) {
  const pkgPath = path.join(cwd, 'package.json')
  if (!fs.existsSync(pkgPath)) return []
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const imports = pkg.imports || {}
  const targets = []
  for (const [alias, value] of Object.entries(imports)) {
    for (const target of collectStringTargets(value)) {
      const abs = path.resolve(cwd, target)
      if (alias.includes('*') && target.includes('*')) {
        targets.push({
          isPattern: true,
          aliasPattern: alias,
          regex: buildPatternRegex(abs.replace(CODE_EXT_RE, ''))
        })
      } else {
        targets.push({
          isPattern: false,
          alias,
          withExt: abs,
          noExt: abs.replace(CODE_EXT_RE, '')
        })
      }
    }
  }
  return targets
}

const cache = new Map()
function getAliasTargets(cwd) {
  if (!cache.has(cwd)) cache.set(cwd, loadAliasTargets(cwd))
  return cache.get(cwd)
}

function resolveRelative(fromFile, spec) {
  const abs = path.resolve(path.dirname(fromFile), spec)
  return abs.replace(CODE_EXT_RE, '')
}

function findMatch(resolved, targets) {
  const indexPath = path.join(resolved, 'index')
  for (const t of targets) {
    if (t.isPattern) {
      const m = t.regex.exec(resolved) || t.regex.exec(indexPath)
      if (m) return t.aliasPattern.replaceAll('*', m[1])
    } else if (
      resolved === t.noExt ||
      resolved === t.withExt ||
      indexPath === t.noExt
    ) {
      return t.alias
    }
  }
  return null
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    messages: {
      preferAlias:
        'Use package alias "{{alias}}" instead of relative path "{{spec}}".'
    }
  },
  create(context) {
    const targets = getAliasTargets(context.cwd)
    if (targets.length === 0) return {}

    function check(node) {
      const spec = node.source.value
      if (typeof spec !== 'string') return
      if (!spec.startsWith('.')) return

      const resolved = resolveRelative(context.filename, spec)
      const suggested = findMatch(resolved, targets)
      if (!suggested) return

      context.report({
        node: node.source,
        messageId: 'preferAlias',
        data: { alias: suggested, spec },
        fix(fixer) {
          return fixer.replaceText(node.source, `'${suggested}'`)
        }
      })
    }

    return {
      ImportDeclaration: check,
      ExportNamedDeclaration(node) {
        if (node.source) check(node)
      },
      ExportAllDeclaration: check
    }
  }
}
