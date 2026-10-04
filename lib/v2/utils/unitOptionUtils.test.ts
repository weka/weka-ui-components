import { describe, expect, it } from 'vitest'

import {
  DEFAULT_CAPACITY_UNIT_LABELS,
  resolveAdoptedUnit,
  resolveDefaultUnit,
  toShortUnitOptions
} from '#v2/utils/unitOptionUtils'

const MAX_SHORT_LABEL_LENGTH = 3
const KILO = 1000
const MB = KILO * KILO
const GB = MB * KILO
const TB = GB * KILO

const CAPACITY_OPTIONS = [
  { label: 'TB', value: TB },
  { label: 'GB', value: GB },
  { label: 'MB', value: MB },
  { label: 'Bytes', value: 1 }
]

const TIME_UNIT_OPTIONS = [
  { label: 'Months', value: 2592000 },
  { label: 'Weeks', value: 604800 },
  { label: 'Days', value: 86400 },
  { label: 'Hours', value: 3600 },
  { label: 'Minutes', value: 60 },
  { label: 'Seconds', value: 1 }
]

describe('toShortUnitOptions', () => {
  it('shortens long unit labels to at most 3 characters', () => {
    const shortened = toShortUnitOptions(TIME_UNIT_OPTIONS)

    expect(shortened.map((o) => o.label)).toEqual([
      'Mo',
      'Wk',
      'D',
      'Hr',
      'Min',
      'Sec'
    ])
    shortened.forEach((o) => {
      expect(o.label.length).toBeLessThanOrEqual(MAX_SHORT_LABEL_LENGTH)
    })
  })

  it('shortens Bytes and keeps already-short capacity labels as-is', () => {
    const shortened = toShortUnitOptions(CAPACITY_OPTIONS)

    expect(shortened.map((o) => o.label)).toEqual(['TB', 'GB', 'MB', 'B'])
  })

  it('keeps the option values untouched', () => {
    const shortened = toShortUnitOptions(TIME_UNIT_OPTIONS)

    expect(shortened.map((o) => o.value)).toEqual(
      TIME_UNIT_OPTIONS.map((o) => o.value)
    )
  })

  it('shortens rate labels while keeping the /s suffix', () => {
    const shortened = toShortUnitOptions([
      { label: 'Bytes/s', value: 1 },
      { label: 'GB/s', value: GB }
    ])

    expect(shortened.map((o) => o.label)).toEqual(['B/s', 'GB/s'])
  })
})

describe('resolveDefaultUnit', () => {
  it('picks the first option matching a preferred label', () => {
    const unit = resolveDefaultUnit(
      CAPACITY_OPTIONS,
      DEFAULT_CAPACITY_UNIT_LABELS
    )

    expect(unit).toEqual({ label: 'GB', value: GB })
  })

  it('matches a preferred label on a rate option carrying the /s suffix', () => {
    const rateOptions = CAPACITY_OPTIONS.map((option) => ({
      ...option,
      label: `${option.label}/s`
    }))

    const unit = resolveDefaultUnit(rateOptions, DEFAULT_CAPACITY_UNIT_LABELS)

    expect(unit).toEqual({ label: 'GB/s', value: GB })
  })

  it('falls back to the first option when no preferred label matches', () => {
    const unit = resolveDefaultUnit(CAPACITY_OPTIONS, ['no-such-unit'])

    expect(unit).toEqual(CAPACITY_OPTIONS[0])
  })

  it('returns undefined for an empty option list', () => {
    expect(resolveDefaultUnit([], DEFAULT_CAPACITY_UNIT_LABELS)).toBeUndefined()
  })
})

describe('resolveAdoptedUnit', () => {
  const DEFAULT_UNIT = { label: 'GB', value: GB }

  it('keeps a unit that already has a value', () => {
    const currentUnit = { label: 'MB', value: MB }

    expect(resolveAdoptedUnit(currentUnit, DEFAULT_UNIT)).toBe(currentUnit)
  })

  it('adopts the default unit when the current unit is unset', () => {
    const adopted = resolveAdoptedUnit(
      { label: undefined, value: undefined },
      DEFAULT_UNIT
    )

    expect(adopted).toEqual({ label: 'GB', value: GB })
  })

  it('returns an empty unit when there is no default to adopt', () => {
    expect(resolveAdoptedUnit(undefined, undefined)).toEqual({
      label: undefined,
      value: undefined
    })
  })
})
