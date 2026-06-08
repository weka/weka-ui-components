export interface CapacityUnit {
  label: string
  value: number
}

export interface CapacityThreshold {
  value: number
  unit: CapacityUnit
}

export interface CapacityRangeValueRuntime {
  min?: CapacityThreshold
  max?: CapacityThreshold
}

export interface CapacityRangeFilterRuntime {
  mode: string
  total: CapacityRangeValueRuntime
  used: CapacityRangeValueRuntime
}

export const CAPACITY_RANGE_MODES = {
  USED: 'used',
  TOTAL: 'total'
} as const

export type CapacityRangeMode =
  (typeof CAPACITY_RANGE_MODES)[keyof typeof CAPACITY_RANGE_MODES]

export interface CapacityRangeFilterType {
  mode: CapacityRangeMode
  total: CapacityRangeValueRuntime
  used: CapacityRangeValueRuntime
}
