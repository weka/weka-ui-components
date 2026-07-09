import type { ReactElement, ReactNode, SVGProps } from 'react'
import type { BarProps } from 'recharts'
import type { ActiveShape } from 'recharts/types/util/types'

import {
  Area,
  Bar,
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
import {
  CHART_COLOR_SCHEME,
  CHART_COLOR_VARS,
  CHART_COLORS
} from '../chartConstants'
import { getChartGradientsFade } from '../chartGradients'
import {
  type ChartDataPoint,
  type ChartMargin,
  type ChartSyncMethod,
  SERIES_TYPES,
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
const ANIMATION_DURATION = 200
const X_AXIS_PADDING = { left: 20, right: 20 }
const AREA_FILL_OPACITY = 0.33
const DEFAULT_STROKE_WIDTH = 3
const GRADIENT_REGEX = /gradient-(\w+)-fade/

type TooltipCursor = boolean | ReactElement | SVGProps<SVGElement>

export interface BaseComposedChartProps {
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
  cursor?: TooltipCursor
  gradients?: ReactNode
  getColorForSeries?: (series: SeriesConfig, index: number) => string
  getStrokeWidth?: (series: SeriesConfig) => number
  customBarShape?: ActiveShape<BarProps, SVGPathElement>
  barStackId?: string
  areaStackId?: string
  extraClass?: string
  syncId?: string
  syncMethod?: ChartSyncMethod
}

function extractStrokeColor(color: string): string {
  if (!color.startsWith('url(#gradient-')) {
    return color
  }
  const match = GRADIENT_REGEX.exec(color)
  if (match?.[1]) {
    const colorName = match[1] as keyof typeof CHART_COLOR_VARS
    return CHART_COLOR_VARS[colorName] ?? color
  }
  return color
}

export function BaseComposedChart({
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
  cursor,
  gradients,
  getColorForSeries,
  getStrokeWidth,
  customBarShape,
  barStackId,
  areaStackId,
  extraClass,
  syncId,
  syncMethod
}: Readonly<BaseComposedChartProps>) {
  if (isLoading) {
    return <LoadingState type={STATE_TYPES.LOADING} />
  }

  if (isError) {
    return <LoadingState type={STATE_TYPES.ERROR} />
  }

  if (noData) {
    return <EmptyChartState />
  }

  const defaultGradients =
    gradients ?? getChartGradientsFade([...CHART_COLOR_SCHEME])
  const { domain: paddedDomain } = calculateChartDomain(data, xAxis)

  const renderSeries = series.map((seriesItem, index) => {
    const color = getColorForSeries
      ? getColorForSeries(seriesItem, index)
      : seriesItem.color
    const strokeWidth = getStrokeWidth
      ? getStrokeWidth(seriesItem)
      : DEFAULT_STROKE_WIDTH
    const isHidden = hiddenMetrics.has(seriesItem.key)

    if (seriesItem.type === SERIES_TYPES.AREA) {
      return (
        <Area
          key={seriesItem.key}
          animationDuration={ANIMATION_DURATION}
          dataKey={seriesItem.key}
          fill={color}
          fillOpacity={AREA_FILL_OPACITY}
          hide={isHidden}
          name={seriesItem.name}
          stackId={areaStackId}
          stroke={extractStrokeColor(color)}
          strokeWidth={strokeWidth}
          type='monotone'
        />
      )
    }

    if (seriesItem.type === SERIES_TYPES.BAR) {
      return (
        <Bar
          key={seriesItem.key}
          animationDuration={ANIMATION_DURATION}
          dataKey={seriesItem.key}
          fill={color}
          hide={isHidden}
          name={seriesItem.name}
          shape={customBarShape}
          stackId={barStackId}
        />
      )
    }

    return (
      <Line
        key={seriesItem.key}
        animationDuration={ANIMATION_DURATION}
        dataKey={seriesItem.key}
        dot={false}
        hide={isHidden}
        name={seriesItem.name}
        stroke={color}
        strokeWidth={strokeWidth}
        type='monotone'
      />
    )
  })

  return (
    <StableChartContainer extraClass={extraClass}>
      <ComposedChart
        data={data}
        margin={margin}
        syncId={syncId}
        syncMethod={syncMethod}
      >
        <defs>{defaultGradients}</defs>
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
        {renderSeries}
        {children}
      </ComposedChart>
    </StableChartContainer>
  )
}
