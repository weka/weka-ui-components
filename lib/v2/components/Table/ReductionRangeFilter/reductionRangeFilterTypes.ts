import type { CapacityRangeValueRuntime } from '../CapacityRangeFilter/capacityRangeFilterTypes'
import type { NumRangeFilterType } from '../NumberRange'

export const REDUCTION_RANGE_MODES = {
  RATIO: 'ratio',
  REDUCED_SIZE: 'reducedSize'
} as const

export const REDUCTION_RANGE_LABELS = {
  [REDUCTION_RANGE_MODES.RATIO]: 'Ratio',
  [REDUCTION_RANGE_MODES.REDUCED_SIZE]: 'Reduced Size'
} as const

export type ReductionRangeMode =
  (typeof REDUCTION_RANGE_MODES)[keyof typeof REDUCTION_RANGE_MODES]

export interface ReductionRangeFilterType {
  mode: ReductionRangeMode
  ratio: NumRangeFilterType
  reducedSize: CapacityRangeValueRuntime
}
