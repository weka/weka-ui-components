import type { CapacityUnit } from './capacityRangeFilterTypes'

import { describe, expect, it } from 'vitest'

import { CAPACITY_RANGE_MODES } from './capacityRangeFilterTypes'
import {
  calculateBytesFromOption,
  isCapacityRangeEmpty,
  isValidCapacityRange,
  isWithinRange
} from './capacityRangeFilterUtils'

const GB: CapacityUnit = { label: 'GB', value: 1_000_000_000 }
const TWO = 2
const FOUR = 4
const TWO_GB = 2_000_000_000
const THREE_GB = 3_000_000_000
const FIVE_GB = 5_000_000_000

describe('calculateBytesFromOption', () => {
  it('multiplies value by the unit size', () => {
    expect(calculateBytesFromOption({ value: TWO, unit: GB })).toBe(TWO_GB)
  })

  it('returns null when value is missing', () => {
    expect(
      calculateBytesFromOption({ value: null as unknown as number, unit: GB })
    ).toBeNull()
  })
})

describe('isWithinRange', () => {
  it('respects optional min/max bounds', () => {
    expect(isWithinRange(THREE_GB, TWO_GB, FIVE_GB)).toBe(true)
    expect(isWithinRange(THREE_GB, FOUR * GB.value, undefined)).toBe(false)
    expect(isWithinRange(THREE_GB, undefined, undefined)).toBe(true)
  })
})

describe('isValidCapacityRange', () => {
  it('accepts max >= min', () => {
    expect(
      isValidCapacityRange({
        min: { value: TWO, unit: GB },
        max: { value: FOUR, unit: GB }
      })
    ).toBe(true)
  })

  it('rejects max < min', () => {
    expect(
      isValidCapacityRange({
        min: { value: FOUR, unit: GB },
        max: { value: TWO, unit: GB }
      })
    ).toBe(false)
  })

  it('accepts a single-sided bound', () => {
    expect(isValidCapacityRange({ min: { value: TWO, unit: GB } })).toBe(true)
  })
})

describe('isCapacityRangeEmpty', () => {
  it('is empty when the active mode has no bounds', () => {
    expect(
      isCapacityRangeEmpty({
        mode: CAPACITY_RANGE_MODES.USED,
        used: {},
        total: { min: { value: TWO, unit: GB } }
      })
    ).toBe(true)
  })

  it('is not empty when the active mode has a bound', () => {
    expect(
      isCapacityRangeEmpty({
        mode: CAPACITY_RANGE_MODES.USED,
        used: { min: { value: TWO, unit: GB } },
        total: {}
      })
    ).toBe(false)
  })
})
