// Shared by searchWorker and the synchronous fallback in useSearchWorker.
// Must stay dependency-free so the emitted worker chunk stays tiny.

export interface CountMatchesOptions {
  isRegex: boolean
  caseSensitive: boolean
  wholeWord: boolean
}

export interface CountMatchesResult {
  count: number
  exceeded: boolean
}

/**
 * Ace renders a highlight marker per match; above this budget the marker
 * layer freezes the page, so counting stops here and reports `exceeded`
 */
export const MAX_HIGHLIGHTED_MATCHES = 999

function escapeRegExp(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function countMatches(
  content: string,
  term: string,
  options: CountMatchesOptions,
  limit: number = MAX_HIGHLIGHTED_MATCHES
): CountMatchesResult {
  if (!content || !term) {
    return { count: 0, exceeded: false }
  }

  let source = options.isRegex ? term : escapeRegExp(term)
  if (options.wholeWord) {
    source = `\\b${source}\\b`
  }

  let regex: RegExp
  try {
    regex = new RegExp(source, options.caseSensitive ? 'g' : 'gi')
  } catch {
    return { count: 0, exceeded: false }
  }

  let count = 0
  let match = regex.exec(content)
  while (match) {
    count += 1
    if (count > limit) {
      return { count: limit, exceeded: true }
    }
    if (match.index === regex.lastIndex) {
      // zero-width match (e.g. regex "a*") — advance to avoid an infinite loop
      regex.lastIndex += 1
    }
    match = regex.exec(content)
  }

  return { count, exceeded: false }
}
