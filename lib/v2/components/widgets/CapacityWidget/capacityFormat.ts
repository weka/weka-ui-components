import { PERCENTAGE } from '#v2/utils/consts'

export const DEFAULT_CAPACITY_UNIT = 'TB'

const VALUE_UNIT_SEPARATOR = ' '
const SMALL_VALUE_DECIMALS = 3
const MEDIUM_VALUE_DECIMALS = 2
const LARGE_VALUE_DECIMALS = 1
const SMALL_VALUE_THRESHOLD = 1
const MEDIUM_VALUE_THRESHOLD = 10

export interface FormattedCapacity {
  value: string
  unit: string
}

/** Drops trailing decimal zeros so `'498.00'` -> `'498'`, `'1.50'` -> `'1.5'`. */
function stripTrailingZeros(value: string): string {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? value : String(parsed)
}

/**
 * Splits a value into a display number and unit. A pre-formatted `displayValue`
 * (e.g. `'406.5 TB'`) wins; otherwise the numeric `value` is formatted with a
 * decimal precision that scales down as the magnitude grows. Trailing decimal
 * zeros are trimmed either way (no `'498.00'`).
 */
export function formatCapacity(
  value: number,
  unit: string,
  displayValue?: string
): FormattedCapacity {
  if (displayValue) {
    const [valuePart, unitPart] = displayValue.split(VALUE_UNIT_SEPARATOR)
    return { value: stripTrailingZeros(valuePart), unit: unitPart || unit }
  }

  if (value < SMALL_VALUE_THRESHOLD) {
    return {
      value: stripTrailingZeros(value.toFixed(SMALL_VALUE_DECIMALS)),
      unit
    }
  }
  if (value < MEDIUM_VALUE_THRESHOLD) {
    return {
      value: stripTrailingZeros(value.toFixed(MEDIUM_VALUE_DECIMALS)),
      unit
    }
  }
  return {
    value: stripTrailingZeros(value.toFixed(LARGE_VALUE_DECIMALS)),
    unit
  }
}

/** Percentage of `part` out of `whole`, or 0 when `whole` is non-positive. */
export function toPercentage(part: number, whole: number): number {
  return whole > 0 ? (part / whole) * PERCENTAGE.FULL : 0
}

/** `'100%'` when full, otherwise a single-decimal percentage string. */
export function formatPercentage(percentage: number): string {
  return percentage === PERCENTAGE.FULL
    ? '100%'
    : `${percentage.toFixed(LARGE_VALUE_DECIMALS)}%`
}

/** Clamps a percentage into the renderable `[0, 100]` range. */
export function clampPercentage(percentage: number): number {
  return Math.min(PERCENTAGE.FULL, Math.max(0, percentage))
}
