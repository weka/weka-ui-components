import {
  REDUCTION_RANGE_MODES,
  type ReductionRangeFilterType
} from './reductionRangeFilterTypes'

/** True when the active reduction mode (ratio or reduced size) has no bounds. */
export function isReductionRangeEmpty(
  value: ReductionRangeFilterType
): boolean {
  if (value.mode === REDUCTION_RANGE_MODES.RATIO) {
    const { ratio } = value
    return !ratio || (ratio.min == null && ratio.max == null)
  }
  const { reducedSize } = value
  return !reducedSize || (!reducedSize.min && !reducedSize.max)
}
