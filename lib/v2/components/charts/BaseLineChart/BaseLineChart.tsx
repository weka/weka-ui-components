import type { ReactElement, ReactNode, SVGProps } from 'react'

import {
  CartesianGrid,
  ComposedChart,
  Line,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { EMPTY_SET } from '#v2/utils/consts'

import { EmptyChartState } from '../../EmptyChartState'
import { LoadingState, STATE_TYPES } from '../../LoadingState'
import { CHART_COLORS } from '../chartConstants'
import {
  type ChartDataPoint,
  type ChartMargin,
  type ChartSyncMethod,
  type SeriesConfig,
  type XAxisExtendedConfig,
  type YAxisExtendedConfig
} from '../chartTypes'
import { StableChartContainer } from '../StableChartContainer'
import {
  buildXAxisConfig,
  buildXAxisStyleProps,
  buildYAxisConfig,
  buildYAxisStyleProps
} from '../utils/axisConfigBuilders'
import { calculateChartDomain } from '../utils/chartDomainUtils'

const DEFAULT_MARGIN = { top: 20, right: 30, left: -20, bottom: 0 }
const MIN_TICK_GAP = 40
const LINE_ANIMATION_DURATION = 200
const X_AXIS_PADDING = { left: 20, right: 20 }

type TooltipCursor = boolean | ReactElement | SVGProps<SVGElement>

export interface BaseLineChartProps {
  data: ChartDataPoint[]
  series: SeriesConfig[]
  isLoading?: boolean
  isError?: boolean
  noData?: boolean
  margin?: ChartMargin
  xAxis?: XAxisExtendedConfig
  yAxis?: YAxisExtendedConfig
  tooltip?: ReactElement
  children?: ReactNode
  hiddenMetrics?: Set<string>
  strokeWidth?: number
  showDot?: boolean
  cursor?: TooltipCursor
  syncId?: string
  syncMethod?: ChartSyncMethod
}

export function BaseLineChart({
  data,
  series,
  isLoading = false,
  isError = false,
  noData = false,
  margin = DEFAULT_MARGIN,
  xAxis,
  yAxis,
  tooltip,
  children,
  hiddenMetrics = EMPTY_SET,
  strokeWidth = 3,
  showDot = false,
  cursor,
  syncId,
  syncMethod
}: Readonly<BaseLineChartProps>) {
  if (isLoading) {
    return <LoadingState type={STATE_TYPES.LOADING} />
  }

  if (isError) {
    return <LoadingState type={STATE_TYPES.ERROR} />
  }

  if (noData) {
    return <EmptyChartState />
  }

  const { domain: paddedDomain } = calculateChartDomain(data, xAxis)

  return (
    <StableChartContainer>
      <ComposedChart
        data={data}
        margin={margin}
        syncId={syncId}
        syncMethod={syncMethod}
      >
        <CartesianGrid
          opacity={1}
          stroke={CHART_COLORS.GRID_STROKE}
          strokeDasharray='2 2'
          strokeWidth={1}
          vertical={false}
        />
        <XAxis
          minTickGap={MIN_TICK_GAP}
          padding={X_AXIS_PADDING}
          tickLine={{ transform: 'translate(0, 1)', strokeWidth: 1 }}
          domain={
            (xAxis?.domain ?? paddedDomain) as [
              number | string,
              number | string
            ]
          }
          {...buildXAxisStyleProps(xAxis)}
          {...buildXAxisConfig(xAxis)}
        />
        <YAxis
          domain={yAxis?.domain}
          tickLine={false}
          {...buildYAxisStyleProps(yAxis)}
          {...buildYAxisConfig(yAxis)}
        />
        {tooltip ? (
          <Tooltip
            allowEscapeViewBox={{ x: false, y: false }}
            content={tooltip}
            cursor={cursor}
            position={{ x: undefined, y: undefined }}
            wrapperStyle={{ outline: 'none' }}
          />
        ) : null}
        {series.map((seriesItem) => (
          <Line
            key={seriesItem.key}
            animationDuration={LINE_ANIMATION_DURATION}
            dataKey={seriesItem.key}
            dot={showDot}
            hide={hiddenMetrics.has(seriesItem.key)}
            name={seriesItem.name}
            stroke={seriesItem.color}
            strokeWidth={strokeWidth}
            type='monotone'
          />
        ))}
        {children}
      </ComposedChart>
    </StableChartContainer>
  )
}
