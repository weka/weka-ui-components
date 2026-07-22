import type { UnifiedTooltipProps } from './types'
import type { CSSProperties } from 'react'

import { createPortal } from 'react-dom'

import { DateTimeIcon } from '../../../icons'
import { formatTooltipTimestamp } from '../../charts/utils/xAxisFormatters'

import styles from './unifiedTooltip.module.scss'

const TOOLTIP_OFFSET_PX = 12
const TOOLTIP_WIDTH_PX = 200
const MIN_TOP_PX = 8
const DATE_ICON_SIZE = 16

interface TooltipPosition {
  left: number
  top: number
}

/**
 * Fixed-position coordinates for a tooltip anchored near the cursor: offset
 * down-right by default, flipped to the left of the cursor when it would
 * overflow the viewport's right edge, and clamped so it never renders above
 * the viewport's top edge.
 */
function calculateTooltipPosition(
  viewportX: number,
  viewportY: number
): TooltipPosition {
  const overflowsRight =
    viewportX + TOOLTIP_OFFSET_PX + TOOLTIP_WIDTH_PX > window.innerWidth
  const left = overflowsRight
    ? viewportX - TOOLTIP_OFFSET_PX - TOOLTIP_WIDTH_PX
    : viewportX + TOOLTIP_OFFSET_PX

  const top = Math.max(viewportY + TOOLTIP_OFFSET_PX, MIN_TOP_PX)

  return { left, top }
}

/**
 * Combined hover tooltip for the three synced mini charts: a single popover
 * showing throughput/IOPS/latency at the shared `dataIndex`. Rendered through
 * a portal into `document.body` with `position: fixed` at the viewport
 * coordinates so it renders at 1x and tracks the cursor exactly even when an
 * ancestor applies a CSS `zoom`.
 */
export function UnifiedTooltip({
  dataIndex,
  label,
  metrics,
  viewportX,
  viewportY,
  dataTestId
}: Readonly<UnifiedTooltipProps>) {
  if (dataIndex < 0) {
    return null
  }

  const points = metrics.map((metric) => metric.data[dataIndex])
  const timestampedPoint = points.find(
    (point) => point?.timestamp !== undefined
  )
  const formattedTimestamp =
    timestampedPoint?.timestamp !== undefined
      ? formatTooltipTimestamp(timestampedPoint.timestamp)
      : label

  const { left, top } = calculateTooltipPosition(viewportX, viewportY)

  const tooltipStyle = {
    '--tooltip-left': `${left}px`,
    '--tooltip-top': `${top}px`
  } as CSSProperties

  return createPortal(
    <div
      className={styles.unifiedTooltip}
      data-testid={dataTestId}
      style={tooltipStyle}
    >
      <div className={styles.tooltipTime}>
        <DateTimeIcon
          extraClass={styles.tooltipIcon}
          height={DATE_ICON_SIZE}
          width={DATE_ICON_SIZE}
        />
        {formattedTimestamp}
      </div>
      <div className={styles.tooltipMetrics}>
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={styles.tooltipMetric}
          >
            <div
              className={styles.tooltipMetricDot}
              style={{ backgroundColor: metric.color }}
            />
            <span className={styles.tooltipMetricLabel}>{metric.label}</span>
            <span className={styles.tooltipMetricValue}>
              {metric.formatValue(points[index]?.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>,
    document.body
  )
}
