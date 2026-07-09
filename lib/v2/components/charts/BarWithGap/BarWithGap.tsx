import type { ReactElement } from 'react'

import { EMPTY_STRING } from '#v2/utils/consts'

interface BarWithGapProps {
  x: number
  y: number
  width: number
  height: number
  fill: string
}

const GAP_SIZE = 0
const RADIUS = 4

/**
 * Recharts custom bar shape with rounded top corners.
 * Renders an empty path for zero/negative heights so empty buckets stay invisible.
 */
export function BarWithGap({
  x,
  y,
  width,
  height,
  fill
}: Readonly<BarWithGapProps>): ReactElement {
  if (!height || height <= GAP_SIZE) {
    return (
      <path
        d={EMPTY_STRING}
        fill={fill}
      />
    )
  }

  const path = `
    M ${x},${y + RADIUS}
    Q ${x},${y} ${x + RADIUS},${y}
    L ${x + width - RADIUS},${y}
    Q ${x + width},${y} ${x + width},${y + RADIUS}
    L ${x + width},${y + height - GAP_SIZE}
    L ${x},${y + height - GAP_SIZE}
    Z
  `

  return (
    <path
      d={path}
      fill={fill}
    />
  )
}
