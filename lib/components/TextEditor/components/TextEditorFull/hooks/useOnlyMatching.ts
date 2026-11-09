import type { CountMatchesOptions } from '../workers/countMatches'

import { useMemo } from 'react'

import { buildSearchRegExp } from '../workers/countMatches'

export type ParsedData = [string, unknown][]

function filterMatching(
  valueForMatched: ParsedData,
  searchValue: string,
  searchOptions: CountMatchesOptions
) {
  const regex = buildSearchRegExp(searchValue, searchOptions)
  const filtered = valueForMatched.reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      const isMatch = [key, `${value}`].some(
        (text) => regex && `${text}`.search(regex) >= 0
      )
      if (isMatch) {
        acc[key] = value
      }

      return acc
    },
    {}
  )
  return JSON.stringify(filtered, null, 2)
}

/**
 * The editor value for "Show only matching lines": the `valueForMatched`
 * entries whose key or value match the search term, using the same
 * regex / case / whole-word options as the search highlights.
 */
function useOnlyMatching({
  allowSearch,
  onlyMatching,
  searchValue,
  searchOptions,
  value,
  valueForMatched
}: {
  allowSearch: boolean
  onlyMatching: boolean
  searchValue: string
  searchOptions: CountMatchesOptions
  value: string
  valueForMatched?: ParsedData
}) {
  const { isRegex, caseSensitive, wholeWord } = searchOptions

  return useMemo(() => {
    if (!allowSearch || !onlyMatching || !valueForMatched || !searchValue) {
      return value
    }

    return filterMatching(valueForMatched, searchValue, {
      isRegex,
      caseSensitive,
      wholeWord
    })
  }, [
    allowSearch,
    onlyMatching,
    valueForMatched,
    searchValue,
    isRegex,
    caseSensitive,
    wholeWord,
    value
  ])
}

export default useOnlyMatching
