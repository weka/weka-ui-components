import type { ReactElement, ReactNode } from 'react'

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

import { EmptyChartState } from '../../EmptyChartState'
import { LoadingState, STATE_TYPES } from '../../LoadingState'
import { CHART_COLOR_SCHEME, CHART_COLORS } from '../chartConstants'
import { getChartGradientsVertical } from '../chartGradients'
import {
  type ChartDataPoint,
  type ChartMargin,
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

const DEFAULT_MARGIN = { top: 10, right: 30, left: -20, bottom: 0 }
const MIN_TICK_GAP = 40
const BAR_ANIMATION_DURATION = 200
const DEFAULT_Y_DOMAIN_PADDING = 0.1

export interface BaseBarChartProps {
  data: ChartDataPoint[]
  dataKey: string
  xAxisKey?: string
  isLoading?: boolean
  isError?: boolean
  noData?: boolean
  margin?: ChartMargin
  xAxis?: XAxisExtendedConfig
  yAxis?: YAxisExtendedConfig
  barSize?: number
  fill?: string
  tooltip?: ReactNode
  customShape?: ReactNode
  barGap?: number | string
  barCategoryGap?: number | string
  maxBarSize?: number
  children?: ReactNode
  onBarClick?: (data: Record<string, unknown>) => void
  renderCustomBars?: (data: Record<string, unknown>[]) => ReactNode
  syncId?: string
}

function buildBarChartConfig(
  barGap: number | string | undefined,
  barCategoryGap: number | string | undefined,
  maxBarSize: number | undefined,
  syncId: string | undefined
) {
  const config: Record<string, unknown> = {}
  if (barGap !== undefined) {
    config.barGap = barGap
  }
  if (barCategoryGap !== undefined) {
    config.barCategoryGap = barCategoryGap
  }
  if (maxBarSize !== undefined) {
    config.maxBarSize = maxBarSize
  }
  if (syncId) {
    config.syncId = syncId
  }
  return config
}

function buildBarConfig(
  customShape: ReactNode | undefined,
  onBarClick: ((data: Record<string, unknown>) => void) | undefined
) {
  const config: Record<string, unknown> = {}
  if (customShape) {
    config.shape = customShape
  }
  if (onBarClick) {
    config.onClick = onBarClick
  }
  return config
}

export function BaseBarChart({
  data,
  dataKey,
  xAxisKey = 'name',
  isLoading = false,
  isError = false,
  noData = false,
  margin = DEFAULT_MARGIN,
  xAxis,
  yAxis,
  barSize = 30,
  fill = 'url(#gradient-blue-600-400-vertical)',
  tooltip,
  customShape,
  barGap,
  barCategoryGap,
  maxBarSize,
  children,
  onBarClick,
  renderCustomBars,
  syncId
}: Readonly<BaseBarChartProps>) {
  if (isLoading) {
    return <LoadingState type={STATE_TYPES.LOADING} />
  }

  if (isError) {
    return <LoadingState type={STATE_TYPES.ERROR} />
  }

  if (noData) {
    return <EmptyChartState />
  }

  const yAxisDomain = yAxis?.domain ?? [
    0,
    (dataMax: number) => dataMax + dataMax * DEFAULT_Y_DOMAIN_PADDING
  ]

  return (
    <StableChartContainer>
      <BarChart
        data={data}
        margin={margin}
        {...buildBarChartConfig(barGap, barCategoryGap, maxBarSize, syncId)}
      >
        <defs>{getChartGradientsVertical([...CHART_COLOR_SCHEME])}</defs>
        <CartesianGrid
          opacity={1}
          stroke={CHART_COLORS.GRID_STROKE}
          strokeDasharray='2 2'
          strokeWidth={1}
          vertical={false}
        />
        <XAxis
          dataKey={xAxisKey}
          minTickGap={MIN_TICK_GAP}
          tickLine={{ transform: 'translate(0, 1)', strokeWidth: 1 }}
          {...buildXAxisStyleProps(xAxis)}
          {...buildXAxisConfig(xAxis)}
        />
        <YAxis
          domain={yAxisDomain}
          tickLine={false}
          {...buildYAxisStyleProps(yAxis)}
          {...buildYAxisConfig(yAxis)}
        />
        {tooltip ? (
          <Tooltip
            allowEscapeViewBox={{ x: false, y: false }}
            content={tooltip as ReactElement}
            cursor={false}
            position={{ x: undefined, y: undefined }}
            wrapperStyle={{ outline: 'none' }}
          />
        ) : null}
        {renderCustomBars ? (
          renderCustomBars(data)
        ) : (
          <Bar
            animationDuration={BAR_ANIMATION_DURATION}
            barSize={barSize}
            dataKey={dataKey}
            fill={fill}
            {...buildBarConfig(customShape, onBarClick)}
          />
        )}
        {children}
      </BarChart>
    </StableChartContainer>
  )
}
