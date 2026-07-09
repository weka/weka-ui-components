import { PERCENTAGE } from '#v2/utils/consts'

import { type SeriesConfig, type TooltipPayloadItem } from '../chartTypes'
import { CustomTooltip } from '../CustomTooltip'

const DEGREES_IN_SEMICIRCLE = 180
const MIDPOINT_RATIO = 0.5
const DEFAULT_MIN_PERCENTAGE_THRESHOLD = 5

export interface PieChartPayloadItem {
  name: string
  value: number
  payload: {
    name: string
    value: number
    fill: string
    percentage?: number
    [key: string]: unknown
  }
}

export interface PieTooltipProps {
  active?: boolean
  payload?: PieChartPayloadItem[]
}

interface PieChartLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

interface PieChartLabelOptions {
  className?: string
  fontSize?: number
  fontWeight?: number
  fill?: string
  minPercentageThreshold?: number
}

/**
 * Creates a percentage label renderer for pie charts.
 * Labels are positioned at the midpoint of each slice and hidden for small slices.
 * Note: Recharts provides `percent` as a value from 0 to 1.
 */
export function createPieChartLabelRenderer(
  options: PieChartLabelOptions = {}
) {
  const {
    className,
    fontSize = 14,
    fontWeight = 600,
    fill = 'white',
    minPercentageThreshold = DEFAULT_MIN_PERCENTAGE_THRESHOLD
  } = options

  return function renderPieChartLabel({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: PieChartLabelProps) {
    const RADIAN = Math.PI / DEGREES_IN_SEMICIRCLE
    const radius = innerRadius + (outerRadius - innerRadius) * MIDPOINT_RATIO
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    const percentageValue = percent * PERCENTAGE.FULL

    if (percentageValue < minPercentageThreshold) {
      return null
    }

    return (
      <text
        className={className}
        dominantBaseline='central'
        fill={fill}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor='middle'
        x={x}
        y={y}
      >
        {`${percentageValue.toFixed(0)}%`}
      </text>
    )
  }
}

export const defaultPieChartLabelRenderer = createPieChartLabelRenderer()

interface CreatePieChartTooltipOptions {
  formatPayload: (payload: PieChartPayloadItem[]) => TooltipPayloadItem[]
  series: SeriesConfig[]
  valueAlignment?: 'left' | 'right'
}

/**
 * Creates a tooltip renderer for pie charts with consistent styling.
 * Note: formatPayload should include formattedValue for each item to ensure
 * correct display when multiple items have the same numeric value.
 */
export function createPieChartTooltip({
  formatPayload,
  series,
  valueAlignment
}: CreatePieChartTooltipOptions) {
  return function PieChartTooltip({ active, payload }: PieTooltipProps) {
    if (!active || !payload || !payload.length) {
      return null
    }

    const formattedPayload = formatPayload(payload)
    return (
      <CustomTooltip
        active={active}
        label={payload[0]?.name}
        payload={formattedPayload}
        series={series}
        valueAlignment={valueAlignment}
      />
    )
  }
}
