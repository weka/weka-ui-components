import { EMPTY_STRING } from '#v2/utils/consts'

export const UNIT_TYPES = {
  BASE10: 'BASE10',
  BASE2_AUTO: 'BASE2'
} as const

export type CapacityUnitType = (typeof UNIT_TYPES)[keyof typeof UNIT_TYPES]

export const SIZES_BASE10 = {
  BYTES: 'Bytes',
  KB: 'KB',
  MB: 'MB',
  GB: 'GB',
  TB: 'TB',
  PB: 'PB',
  EB: 'EB',
  ZB: 'ZB',
  YB: 'YB'
}

export const SIZES_BASE2 = {
  BYTES: 'Bytes',
  KiB: 'KiB',
  MiB: 'MiB',
  GiB: 'GiB',
  TiB: 'TiB',
  PiB: 'PiB',
  EiB: 'EiB',
  ZiB: 'ZiB',
  YiB: 'YiB'
}

export const BYTE_METRIC_BASE = 1000
export const BYTE_METRIC_BASE2 = 1024

const ROUND_AT = 100
const ABBREVIATE_AT = 10
const MAX_DECIMALS = 2

interface FormattedCapacity {
  value: number
  unit: string
  displayValue: string
}

/** Returns the size labels and base (1000 or 1024) for the given unit type. */
export function getUnitsConfig(unitType: string) {
  return unitType === UNIT_TYPES.BASE2_AUTO
    ? { sizes: SIZES_BASE2, base: BYTE_METRIC_BASE2 }
    : { sizes: SIZES_BASE10, base: BYTE_METRIC_BASE }
}

/** Formats a numeric value with magnitude-aware precision, stripping trailing zeros. */
export function formatNumericValue(value: number, decimals: number): string {
  if (value === 0) {
    return '0'
  }
  if (value >= ROUND_AT) {
    return value.toFixed(0)
  }
  if (value >= ABBREVIATE_AT) {
    return value.toFixed(1).replace(/\.0$/, EMPTY_STRING)
  }
  return value
    .toFixed(Math.min(MAX_DECIMALS, decimals))
    .replace(/\.0+$/, EMPTY_STRING)
}

function findOptimalUnit(absBytes: number, sizes: string[], base: number) {
  let unitIndex = 0
  let value = absBytes

  while (value >= base && unitIndex < sizes.length - 1) {
    value /= base
    unitIndex += 1
  }

  while (value < 1 && unitIndex > 0) {
    unitIndex -= 1
    value *= base
  }

  return { value, unitIndex }
}

const DEFAULT_DECIMALS = 1

interface FormatCapacityParams {
  bytes: number
  decimals?: number
  unitType?: string
}

/**
 * Smart capacity formatter that auto-selects the most appropriate unit. Uses
 * base 1000 for BASE10 units and base 1024 for BASE2 units. Pure — pass
 * `unitType` to control the unit family (defaults to BASE10).
 */
export function formatCapacitySmart({
  bytes,
  decimals = DEFAULT_DECIMALS,
  unitType = UNIT_TYPES.BASE10
}: FormatCapacityParams): FormattedCapacity {
  if (bytes === 0) {
    return { value: 0, unit: 'Bytes', displayValue: '0 Bytes' }
  }

  const dm = decimals < 0 ? 0 : decimals
  const absBytes = Math.abs(bytes)

  const { sizes, base } = getUnitsConfig(unitType)
  const sizesValues = Object.values(sizes)

  const { value, unitIndex } = findOptimalUnit(absBytes, sizesValues, base)
  const formattedValue = formatNumericValue(value, dm)

  return {
    value: parseFloat(formattedValue),
    unit: sizesValues[unitIndex],
    displayValue: `${formattedValue} ${sizesValues[unitIndex]}`
  }
}
