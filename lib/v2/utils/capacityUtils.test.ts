import { describe, expect, it } from 'vitest'

import {
  formatCapacitySmart,
  formatNumericValue,
  getUnitsConfig,
  UNIT_TYPES
} from '#v2/utils/capacityUtils'

const DECIMAL_BASE = 1000
const BINARY_BASE = 1024
const MB_DECIMAL = 1_500_000
const MIB_BINARY = 1_048_576
const NEGATIVE_MB = -2_000_000
const ABOVE_HUNDRED = 123.4

describe('getUnitsConfig', () => {
  it('uses base 1000 + decimal labels for BASE10', () => {
    const { base, sizes } = getUnitsConfig(UNIT_TYPES.BASE10)
    expect(base).toBe(DECIMAL_BASE)
    expect(Object.values(sizes)).toContain('KB')
  })

  it('uses base 1024 + binary labels for BASE2', () => {
    const { base, sizes } = getUnitsConfig(UNIT_TYPES.BASE2_AUTO)
    expect(base).toBe(BINARY_BASE)
    expect(Object.values(sizes)).toContain('KiB')
  })
})

describe('formatNumericValue', () => {
  it('rounds to whole numbers at/above 100', () => {
    expect(formatNumericValue(ABOVE_HUNDRED, 1)).toBe('123')
  })

  it('strips trailing zeros', () => {
    expect(formatNumericValue(0, 1)).toBe('0')
  })
})

describe('formatCapacitySmart', () => {
  it('returns Bytes for zero', () => {
    expect(formatCapacitySmart({ bytes: 0 })).toEqual({
      value: 0,
      unit: 'Bytes',
      displayValue: '0 Bytes'
    })
  })

  it('formats with decimal (BASE10) units by default', () => {
    expect(formatCapacitySmart({ bytes: MB_DECIMAL })).toEqual({
      value: 1.5,
      unit: 'MB',
      displayValue: '1.5 MB'
    })
  })

  it('formats with binary (BASE2) units when requested', () => {
    const result = formatCapacitySmart({
      bytes: MIB_BINARY,
      unitType: UNIT_TYPES.BASE2_AUTO
    })
    expect(result.unit).toBe('MiB')
    expect(result.value).toBe(1)
  })

  it('formats the magnitude of negative values', () => {
    const result = formatCapacitySmart({ bytes: NEGATIVE_MB })
    expect(result.unit).toBe('MB')
    expect(result.displayValue).toBe('2 MB')
  })
})
