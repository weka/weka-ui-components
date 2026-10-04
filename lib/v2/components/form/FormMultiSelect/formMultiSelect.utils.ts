/**
 * Suggestions for a free-entry multi select: the options matching the query,
 * then the query itself as a new value when no option spells it exactly. The
 * autocomplete ignores its `options` once a search handler is set, so the
 * handler has to carry them.
 */
export function buildFreeEntrySuggestions(
  options: readonly string[],
  query: string
): string[] {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }
  const lowerQuery = trimmed.toLowerCase()
  const matches = options.filter((option) =>
    option.toLowerCase().includes(lowerQuery)
  )
  return options.includes(trimmed) ? matches : [...matches, trimmed]
}
