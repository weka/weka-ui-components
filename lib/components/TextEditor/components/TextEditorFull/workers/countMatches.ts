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

/**
 * Builds the RegExp both the match counter and the "only matching lines"
 * filter use, so they agree on regex / case / whole-word semantics.
 * Returns null for an invalid user-typed regex.
 */
export function buildSearchRegExp(
  term: string,
  options: CountMatchesOptions
): RegExp | null {
  let source = options.isRegex ? term : escapeRegExp(term)
  if (options.wholeWord) {
    source = `\\b${source}\\b`
  }

  try {
    return new RegExp(source, options.caseSensitive ? 'g' : 'gi')
  } catch {
    return null
  }
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

  const regex = buildSearchRegExp(term, options)
  if (!regex) {
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
