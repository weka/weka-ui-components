import { EMPTY_STRING } from '#v2/utils/consts'

import { CHART_COLORS } from '../chartConstants'
import { formatXAxisTimestamp } from '../utils/xAxisFormatters'

interface TickPayload {
  value: string | number
}

const DEFAULT_PAYLOAD: TickPayload = { value: EMPTY_STRING }

const TICK_FONT_SIZE = 10
const SECOND_LINE_OFFSET = 12
const SINGLE_LINE_DY = 4

interface CustomTickProps {
  x?: number
  y?: number
  payload?: TickPayload
  range?: string
}

/**
 * Recharts X-axis tick renderer for time axes. Renders two stacked lines
 * (date + time) when the formatted value contains a newline, one line otherwise.
 */
export function CustomTick({
  x = 0,
  y = 0,
  payload = DEFAULT_PAYLOAD,
  range
}: Readonly<CustomTickProps>) {
  const value =
    typeof payload.value === 'number' && range
      ? formatXAxisTimestamp(payload.value, range)
      : payload.value
  if (typeof value === 'string' && value.includes('\n')) {
    const [date, time] = value.split('\n')
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          dy={0}
          fill={CHART_COLORS.AXIS_STROKE}
          fontSize={TICK_FONT_SIZE}
          textAnchor='middle'
          x={0}
          y={0}
        >
          {date}
        </text>
        <text
          dy={0}
          fill={CHART_COLORS.AXIS_STROKE}
          fontSize={TICK_FONT_SIZE}
          textAnchor='middle'
          x={0}
          y={SECOND_LINE_OFFSET}
        >
          {time}
        </text>
      </g>
    )
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        dy={SINGLE_LINE_DY}
        fill={CHART_COLORS.AXIS_STROKE}
        fontSize={TICK_FONT_SIZE}
        textAnchor='middle'
        x={0}
        y={0}
      >
        {value}
      </text>
    </g>
  )
}
