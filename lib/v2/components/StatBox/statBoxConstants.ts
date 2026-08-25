import type { ReactNode } from 'react'

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
  /**
   * When set, the label is truncated with an ellipsis and this full text is
   * shown in a tooltip on hover — but only while the label is actually
   * truncated (handled by the v2 `Tooltip` ellipsis mode). Use for labels
   * whose length isn't bounded, e.g. a `source → peer` name pair.
   */
  labelTooltip?: string
}

export interface StatBoxProps {
  title: string
  colorVariant: StatColorVariant
  mainValue: string | number
  mainUnit?: string
  mainValueAdornment?: ReactNode
  subStats?: StatBoxSubStat[]
  status?: StatBoxStatus
  dataTestId?: string
}
