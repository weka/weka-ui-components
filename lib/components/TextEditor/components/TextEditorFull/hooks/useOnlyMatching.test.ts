import type { ParsedData } from './useOnlyMatching'

import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#consts'

import useOnlyMatching from './useOnlyMatching'

const FULL_VALUE = 'full value'
const VALUE_FOR_MATCHED: ParsedData = [
  ['Foo', 'one'],
  ['foobar', 'two'],
  ['other', 'foo']
]
const DEFAULT_OPTIONS = {
  isRegex: false,
  caseSensitive: false,
  wholeWord: false
}

function getMatchedKeys(
  searchValue: string,
  searchOptions = DEFAULT_OPTIONS
): string[] {
  const { result } = renderHook(() =>
    useOnlyMatching({
      allowSearch: true,
      onlyMatching: true,
      searchValue,
      searchOptions,
      value: FULL_VALUE,
      valueForMatched: VALUE_FOR_MATCHED
    })
  )
  return Object.keys(JSON.parse(result.current) as Record<string, unknown>)
}

describe('useOnlyMatching', () => {
  it('keeps entries whose key or value contain the term, ignoring case by default', () => {
    expect(getMatchedKeys('foo')).toEqual(['Foo', 'foobar', 'other'])
  })

  it('respects case-sensitive search', () => {
    expect(
      getMatchedKeys('Foo', { ...DEFAULT_OPTIONS, caseSensitive: true })
    ).toEqual(['Foo'])
  })

  it('respects whole-word search', () => {
    expect(
      getMatchedKeys('foo', { ...DEFAULT_OPTIONS, wholeWord: true })
    ).toEqual(['Foo', 'other'])
  })

  it('treats the term as a regex when regex search is on', () => {
    expect(
      getMatchedKeys('^foo$', { ...DEFAULT_OPTIONS, isRegex: true })
    ).toEqual(['Foo', 'other'])
  })

  it('matches nothing for an invalid regex', () => {
    expect(getMatchedKeys('(', { ...DEFAULT_OPTIONS, isRegex: true })).toEqual(
      []
    )
  })

  it('returns the full value when the filter is off or the term is empty', () => {
    const { result, rerender } = renderHook(
      ({ onlyMatching, searchValue }) =>
        useOnlyMatching({
          allowSearch: true,
          onlyMatching,
          searchValue,
          searchOptions: DEFAULT_OPTIONS,
          value: FULL_VALUE,
          valueForMatched: VALUE_FOR_MATCHED
        }),
      { initialProps: { onlyMatching: false, searchValue: 'foo' } }
    )
    expect(result.current).toBe(FULL_VALUE)

    rerender({ onlyMatching: true, searchValue: EMPTY_STRING })
    expect(result.current).toBe(FULL_VALUE)
  })
})
