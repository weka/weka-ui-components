export const STAT_COLOR_VARIANT = {
  PURPLE: 'purple',
  FUCHSIA: 'fuchsia',
  CYAN: 'cyan',
  AQUA: 'aqua',
  PEACH: 'peach'
} as const

export type StatColorVariant =
  (typeof STAT_COLOR_VARIANT)[keyof typeof STAT_COLOR_VARIANT]

export const STAT_BOX_STATUS = {
  READY: 'ready',
  LOADING: 'loading',
  ERROR: 'error'
} as const

export type StatBoxStatus =
  (typeof STAT_BOX_STATUS)[keyof typeof STAT_BOX_STATUS]

export interface StatBoxSubStat {
  label: string
  value: string | number
  unit?: string
}

export interface StatBoxProps {
  title: string
  colorVariant: StatColorVariant
  mainValue: string | number
  mainUnit?: string
  subStats?: StatBoxSubStat[]
  status?: StatBoxStatus
  dataTestId?: string
}
