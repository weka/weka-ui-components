import type {
  CompactPerformanceDataPoint,
  RechartsMouseState,
  TooltipState
} from './types'
import type { Dispatch, MouseEvent, SetStateAction } from 'react'

import { useCallback } from 'react'

import { MiniChart } from '../../charts/MiniChart'

import styles from './compactPerformanceChart.module.scss'

interface MiniChartWrapperProps {
  label: string
  data: CompactPerformanceDataPoint[]
  color: string
  formatValue: (value: number) => string
  syncId: string
  isLoading?: boolean
  hasValidData?: boolean
  isHovered: boolean
  onTooltipChange: Dispatch<SetStateAction<TooltipState>>
  dataTestId?: string
}

/**
 * Wraps the shared `MiniChart` with the cross-chart hover coordination
 * (viewport mouse position + active point) that drives the `UnifiedTooltip`;
 * the chart rendering itself lives in `MiniChart`. Viewport coordinates
 * (rather than container-relative ones) let the tooltip be portaled to
 * `document.body` and positioned correctly even when an ancestor applies a
 * CSS `zoom`.
 *
 * Deactivation is intentionally owned by the parent container's `onMouseLeave`,
 * not each chart's: moving between the synced charts crosses the gap between
 * them, and per-chart leave handling would drop the shared tooltip and flash
 * the last-value badges back mid-hover.
 */
export function MiniChartWrapper({
  label,
  data,
  color,
  formatValue,
  syncId,
  isLoading = false,
  hasValidData = true,
  isHovered,
  onTooltipChange,
  dataTestId
}: Readonly<MiniChartWrapperProps>) {
  const handleMouseMove = useCallback(
    (state: RechartsMouseState, event?: MouseEvent) => {
      if (state.activeTooltipIndex === undefined || !state.activeLabel) {
        return
      }

      if (!event) {
        onTooltipChange((prev) => ({
          ...prev,
          active: true,
          label: state.activeLabel as string,
          dataIndex: state.activeTooltipIndex as number
        }))
        return
      }

      onTooltipChange({
        active: true,
        label: state.activeLabel,
        dataIndex: state.activeTooltipIndex,
        viewportX: event.clientX,
        viewportY: event.clientY
      })
    },
    [onTooltipChange]
  )

  const handleWrapperMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onTooltipChange((prev) => {
        if (!prev.active) {
          return prev
        }
        return {
          ...prev,
          viewportX: event.clientX,
          viewportY: event.clientY
        }
      })
    },
    [onTooltipChange]
  )

  return (
    <div
      className={styles.chartHover}
      onMouseMove={handleWrapperMouseMove}
    >
      <MiniChart
        color={color}
        data={data}
        dataTestId={dataTestId}
        fill
        formatValue={formatValue}
        hasValidData={hasValidData}
        hideLastValue={isHovered}
        isLoading={isLoading}
        onMouseMove={handleMouseMove}
        syncId={syncId}
        title={label}
      />
    </div>
  )
}
