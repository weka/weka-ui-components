import type { ReactNode } from 'react'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const DEFAULT_INNER_RADIUS = '75%'
const DEFAULT_OUTER_RADIUS = '100%'
const DEFAULT_PADDING_ANGLE = 3
const DEFAULT_START_ANGLE = 90
const DEFAULT_END_ANGLE = 450

/** Zero margin so the ring fills its container edge-to-edge. */
const NO_MARGIN = { top: 0, right: 0, bottom: 0, left: 0 }

export interface DonutChartSegment {
  name: string
  value: number
  /** Any CSS color, incl. `url(#gradientId)` referencing a gradient in `defs`. */
  color: string
}

export interface DonutChartProps {
  segments: DonutChartSegment[]
  /** SVG `<defs>` content (e.g. gradients) referenced by a segment's `color`. */
  defs?: ReactNode
  innerRadius?: string | number
  outerRadius?: string | number
  paddingAngle?: number
  startAngle?: number
  endAngle?: number
}

/**
 * Reusable donut/pie chart. Fills its container (size it via the parent) and
 * draws one ring segment per `segments` entry. Pass gradient `<defs>` and
 * reference them from a segment's `color` (`url(#id)`).
 */
export function DonutChart({
  segments,
  defs,
  innerRadius = DEFAULT_INNER_RADIUS,
  outerRadius = DEFAULT_OUTER_RADIUS,
  paddingAngle = DEFAULT_PADDING_ANGLE,
  startAngle = DEFAULT_START_ANGLE,
  endAngle = DEFAULT_END_ANGLE
}: Readonly<DonutChartProps>) {
  return (
    <ResponsiveContainer
      height='100%'
      width='100%'
    >
      <PieChart margin={NO_MARGIN}>
        {defs ? <defs>{defs}</defs> : null}
        <Pie
          cx='50%'
          cy='50%'
          data={segments}
          dataKey='value'
          endAngle={endAngle}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          startAngle={startAngle}
          stroke='none'
        >
          {segments.map((segment, index) => (
            <Cell
              key={`cell-${index}`}
              fill={segment.color}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
