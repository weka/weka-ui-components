import type { ReactElement, ReactNode, SVGProps } from 'react'
import type { BarProps } from 'recharts'
import type { ActiveShape } from 'recharts/types/util/types'

import {
  Area,
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { EMPTY_SET } from '#v2/utils/consts'

import { EmptyChartState } from '../../EmptyChartState'
import { LoadingState, STATE_TYPES } from '../../LoadingState'
import { CHART_COLOR_SCHEME, CHART_COLORS } from '../chartConstants'
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
import { resolveSeriesColor } from '../utils/seriesColor'

const DEFAULT_MARGIN = { top: 20, right: 30, left: -20, bottom: 0 }
const MIN_TICK_GAP = 40
const ANIMATION_DURATION = 200
const X_AXIS_PADDING = { left: 20, right: 20 }
const AREA_FILL_OPACITY = 0.33
const DEFAULT_STROKE_WIDTH = 3
/** Height in pixels of the optional `<Brush>` range selector. */
const BRUSH_HEIGHT = 40
/**
 * Width in pixels of the `<Brush>` traveller handles. Matches the grabbable
 * width used for other drag affordances in the design system (e.g.
 * `TableDrawer`'s resize handle) — recharts' 5px default is too thin to grab.
 */
const BRUSH_TRAVELLER_WIDTH = 8
/** Stroke dash pattern applied to `<Line>` series configured with `dashed: true`. */
const DASHED_LINE_STROKE_DASHARRAY = '6 4'
/** Fill opacity of the drag-to-select highlight overlay (`referenceArea`). */
const SELECTION_FILL_OPACITY = 0.2

type TooltipCursor = boolean | ReactElement | SVGProps<SVGElement>

/** Inclusive x-axis span of the drag-to-select zoom highlight overlay. */
export interface ChartSelectionRange {
  x1: number | string
  x2: number | string
}

/**
 * The subset of recharts' internal chart state that drag-to-select consumers
 * read from the chart mouse handlers. `activeLabel` is the x-axis value under
 * the cursor; `activeTooltipIndex` is that point's index in `data`.
 */
export interface ChartMouseState {
  activeLabel?: string | number
  activeTooltipIndex?: number
}

export interface BaseComposedChartProps {
  data: ChartDataPoint[]
  series: SeriesConfig[]
  isLoading?: boolean
  isError?: boolean
  noData?: boolean
  margin?: ChartMargin
  xAxis?: XAxisExtendedConfig
  yAxis?: YAxisExtendedConfig
  /**
   * Config for a secondary right-oriented `<YAxis>`, rendered when any
   * series in `series` sets `yAxisId`.
   */
  rightYAxis?: YAxisExtendedConfig
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
  /** Renders a recharts `<Brush>` range selector bound to the x-axis dataKey. Defaults to `false`. */
  showBrush?: boolean
  /**
   * Highlight overlay spanning `x1`–`x2` on the x-axis, drawn while the user
   * drags to select a zoom range. Pair with the `onMouseDown`/`onMouseMove`/
   * `onMouseUp` handlers (which receive recharts' chart state, including the
   * hovered `activeLabel`) to implement drag-to-select zoom without a `<Brush>`.
   */
  referenceArea?: ChartSelectionRange | null
  onMouseDown?: (state: ChartMouseState) => void
  onMouseMove?: (state: ChartMouseState) => void
  onMouseUp?: (state: ChartMouseState) => void
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
  rightYAxis,
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
  syncMethod,
  showBrush = false,
  referenceArea,
  onMouseDown,
  onMouseMove,
  onMouseUp
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
  const secondaryAxisSeries = series.find(
    (seriesItem) => seriesItem.yAxisId !== undefined
  )

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
          stroke={resolveSeriesColor(color)}
          strokeWidth={strokeWidth}
          type='monotone'
          yAxisId={seriesItem.yAxisId}
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
          yAxisId={seriesItem.yAxisId}
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
        yAxisId={seriesItem.yAxisId}
        strokeDasharray={
          seriesItem.dashed ? DASHED_LINE_STROKE_DASHARRAY : undefined
        }
      />
    )
  })

  return (
    <StableChartContainer extraClass={extraClass}>
      <ComposedChart
        data={data}
        margin={margin}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
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
        {secondaryAxisSeries ? (
          <YAxis
            domain={rightYAxis?.domain}
            orientation='right'
            tickLine={false}
            yAxisId={secondaryAxisSeries.yAxisId}
            {...buildYAxisStyleProps(rightYAxis)}
            {...buildYAxisConfig(rightYAxis)}
          />
        ) : null}
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
        {referenceArea ? (
          <ReferenceArea
            fill={CHART_COLORS.AXIS_STROKE}
            fillOpacity={SELECTION_FILL_OPACITY}
            stroke={CHART_COLORS.AXIS_STROKE}
            strokeOpacity={0.3}
            x1={referenceArea.x1}
            x2={referenceArea.x2}
          />
        ) : null}
        {showBrush ? (
          <Brush
            dataKey={xAxis?.dataKey}
            fill={CHART_COLORS.GRID_STROKE}
            height={BRUSH_HEIGHT}
            stroke={CHART_COLORS.AXIS_STROKE}
            tickFormatter={xAxis?.tickFormatter}
            travellerWidth={BRUSH_TRAVELLER_WIDTH}
          />
        ) : null}
        {children}
      </ComposedChart>
    </StableChartContainer>
  )
}
