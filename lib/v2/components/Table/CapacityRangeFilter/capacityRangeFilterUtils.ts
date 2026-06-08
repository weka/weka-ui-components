import {
  CAPACITY_RANGE_MODES,
  type CapacityRangeFilterType,
  type CapacityRangeValueRuntime,
  type CapacityThreshold
} from './capacityRangeFilterTypes'

/** Converts a capacity threshold ({ value, unit }) to bytes. */
export function calculateBytesFromOption({
  unit,
  value
}: CapacityThreshold): number | null {
  if (value === null || value === undefined) {
    return null
  }
  return unit.value * value
}

/** Resolves a threshold to a byte bound, or undefined when unset. */
export function calculateFilterBound(
  threshold: CapacityThreshold | undefined
): number | undefined {
  return threshold
    ? calculateBytesFromOption(threshold) ?? undefined
    : undefined
}

/** True when `value` falls within the optional [min, max] byte bounds. */
export function isWithinRange(
  value: number,
  min: number | undefined,
  max: number | undefined
): boolean {
  const meetsMinCriteria = min === undefined || value >= min
  const meetsMaxCriteria = max === undefined || value <= max
  return meetsMinCriteria && meetsMaxCriteria
}

/** Type guard for a resolved, finite byte count. */
export function isValidBytes(
  bytes: number | null | undefined
): bytes is number {
  return bytes !== undefined && bytes !== null && !Number.isNaN(bytes)
}

function convertToBytes(
  threshold?: CapacityThreshold
): number | null | undefined {
  if (
    threshold &&
    typeof threshold.value === 'number' &&
    threshold.unit &&
    typeof threshold.unit === 'object'
  ) {
    return calculateBytesFromOption(threshold)
  }
  return undefined
}

/** Validates that a capacity range's max is not smaller than its min. */
export function isValidCapacityRange({
  min,
  max
}: CapacityRangeValueRuntime): boolean {
  const minToBytes = convertToBytes(min)
  const maxToBytes = convertToBytes(max)

  if (isValidBytes(minToBytes) && isValidBytes(maxToBytes)) {
    return maxToBytes >= minToBytes
  }

  return (
    (!Number.isNaN(minToBytes) && !max) || (!Number.isNaN(maxToBytes) && !min)
  )
}

/** True when the active mode's range has neither a min nor a max set. */
export function isCapacityRangeEmpty(value: CapacityRangeFilterType): boolean {
  const activeRange =
    value.mode === CAPACITY_RANGE_MODES.USED ? value.used : value.total
  return !activeRange?.min && !activeRange?.max
}
