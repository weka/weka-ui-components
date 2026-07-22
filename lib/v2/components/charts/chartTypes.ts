export type ChartDataPoint = Record<string, number | string | null | undefined>

export interface TimeSeriesPoint {
  time: string
  timestamp?: number
  value: number
}

export type TickValue = string | number

export type DomainValue = number | string | ((value: number) => number)

export interface TooltipPayloadItem {
  name?: string
  value: number | string
  dataKey: string
  color?: string
  formattedValue?: string
  payload?: {
    timestamp?: number | string
    [key: string]: unknown
  }
}

export const SERIES_TYPES = {
  AREA: 'area',
  LINE: 'line',
  BAR: 'bar'
} as const

export type SeriesType = (typeof SERIES_TYPES)[keyof typeof SERIES_TYPES]

export const BAR_CHART_ORIENTATIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
} as const

export type BarChartOrientation =
  (typeof BAR_CHART_ORIENTATIONS)[keyof typeof BAR_CHART_ORIENTATIONS]

export interface SeriesConfig {
  key: string
  name: string
  color: string
  type: SeriesType
  value?: number
  formattedValue?: string
  href?: string
  valueHref?: string
  /** Binds this series to a secondary `<YAxis>` (rendered on the right) sharing this id. */
  yAxisId?: string
  /** Renders a `<Line>` series with a dashed stroke instead of solid. */
  dashed?: boolean
}

export interface ChartAxisConfig {
  fontSize?: number
  stroke?: string
  strokeWidth?: number
  tickFormatter?: (value: TickValue, index: number) => string
  domain?: [DomainValue, DomainValue]
  width?: number
  height?: number
}

export interface ChartMargin {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export interface XAxisExtendedConfig extends ChartAxisConfig {
  dataKey?: string
  hide?: boolean
  tick?: unknown
  tickMargin?: number
  interval?: number | 'preserveStartEnd'
  type?: 'number' | 'category'
  domain?: [string | number, string | number]
  height?: number
  /**
   * Explicit tick values to render instead of recharts' auto-generated ticks.
   * Use to control tick placement — e.g. to de-duplicate identical formatted
   * labels on a dense time axis.
   */
  ticks?: (number | string)[]
}

export interface YAxisExtendedConfig extends ChartAxisConfig {
  hide?: boolean
  tick?: unknown
  tickSize?: number
  padding?: { top?: number; bottom?: number }
  label?: unknown
  tickLine?: boolean
  includeHidden?: boolean
}

export type ChartSyncMethod =
  | 'index'
  | 'value'
  | ((tooltipTicks: unknown[], data: unknown) => number)
