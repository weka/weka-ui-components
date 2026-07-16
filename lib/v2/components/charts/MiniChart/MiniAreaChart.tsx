import type { MiniChartDataPoint } from './MiniChart'
import type { ComponentProps } from 'react'

import { useId } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { EMPTY_STRING } from '#v2/utils/consts'

type AreaChartProps = ComponentProps<typeof AreaChart>

const RESIZE_DEBOUNCE_MS = 100
const FALLBACK_MAX = 1
const CURSOR_OPACITY = 0.5
const GRADIENT_TOP_OPACITY = 0.8
const GRADIENT_BOTTOM_OPACITY = 0.1
const STROKE_WIDTH = 3
const CHART_MARGIN = { top: 5, right: 12, left: 8, bottom: 5 }

const BASELINE: MiniChartDataPoint[] = [
  { time: 'start', value: 0 },
  { time: 'end', value: 0 }
]

export interface MiniAreaChartProps {
  data: MiniChartDataPoint[]
  color: string
  height: number
  hasValidData: boolean
  /** Fill the container height (height="100%") instead of the fixed `height`. */
  fill?: boolean
  syncId?: string
  onMouseMove?: AreaChartProps['onMouseMove']
  onMouseLeave?: AreaChartProps['onMouseLeave']
}

/** The recharts area-line body of a MiniChart (gradient fill, hidden axes). */
export function MiniAreaChart({
  data,
  color,
  height,
  hasValidData,
  fill = false,
  syncId,
  onMouseMove,
  onMouseLeave
}: Readonly<MiniAreaChartProps>) {
  const gradientId = `mini-chart-gradient-${useId().replace(
    /:/g,
    EMPTY_STRING
  )}`
  const chartData = hasValidData && data.length > 0 ? data : BASELINE

  return (
    <ResponsiveContainer
      debounce={RESIZE_DEBOUNCE_MS}
      height={fill ? '100%' : height}
      width='100%'
    >
      <AreaChart
        data={chartData}
        margin={CHART_MARGIN}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        syncId={syncId}
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1='0'
            x2='0'
            y1='0'
            y2='1'
          >
            <stop
              offset='0%'
              stopColor={color}
              stopOpacity={GRADIENT_TOP_OPACITY}
            />
            <stop
              offset='100%'
              stopColor={color}
              stopOpacity={GRADIENT_BOTTOM_OPACITY}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey='time'
          hide
        />
        <YAxis
          hide
          domain={
            hasValidData
              ? [0, (max: number) => max || FALLBACK_MAX]
              : [0, FALLBACK_MAX]
          }
        />
        <Tooltip
          content={() => null}
          cursor={{
            stroke: color,
            strokeWidth: 1,
            strokeOpacity: CURSOR_OPACITY
          }}
        />
        <Area
          dataKey='value'
          dot={false}
          fill={`url(#${gradientId})`}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          type='monotone'
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
