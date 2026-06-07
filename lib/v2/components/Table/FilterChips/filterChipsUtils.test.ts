import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#consts'

import {
  calculateDisplayWidth,
  formatDatetimeFilter,
  formatMultiselectFilter,
  PIXELS_PER_CHARACTER,
  shouldUseCompactView
} from './filterChipsUtils'

describe('calculateDisplayWidth', () => {
  it('scales with character count', () => {
    const text = 'abcd'
    expect(calculateDisplayWidth(text)).toBe(text.length * PIXELS_PER_CHARACTER)
  })
})

describe('shouldUseCompactView', () => {
  it('is false for one value or fewer', () => {
    expect(shouldUseCompactView(['only'])).toBe(false)
  })

  it('is true once values exceed the count threshold', () => {
    expect(shouldUseCompactView(['a', 'b', 'c', 'd'])).toBe(true)
  })
})

describe('formatMultiselectFilter', () => {
  it('returns a plain display for a single value', () => {
    expect(formatMultiselectFilter(['solo'])).toEqual({
      compact: false,
      display: 'solo'
    })
  })

  it('joins a small number of values without compacting', () => {
    expect(formatMultiselectFilter(['a', 'b'])).toEqual({
      compact: false,
      display: 'a, b'
    })
  })

  it('compacts many values, surfacing the remainder', () => {
    const result = formatMultiselectFilter(['a', 'b', 'c', 'd'])
    expect(result.compact).toBe(true)
    expect(result.display).toBe('a')
    expect(result.values).toEqual(['b', 'c', 'd'])
  })
})

describe('formatDatetimeFilter', () => {
  it('renders from and to parts when present', () => {
    const result = formatDatetimeFilter({
      from: '2026-01-01T00:00:00.000Z',
      to: '2026-02-01T00:00:00.000Z'
    })
    expect(result.display).toContain('from ')
    expect(result.display).toContain('to ')
  })

  it('is empty when neither bound is set', () => {
    expect(formatDatetimeFilter({}).display).toBe(EMPTY_STRING)
  })
})
