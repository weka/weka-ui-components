import type {
  CompactPerformanceChartProps,
  CompactPerformanceMetricData,
  TooltipState
} from './types'

import { useCallback, useId, useMemo, useState } from 'react'

import { EMPTY_STRING } from '#v2/utils/consts'

import { createCommonTimelineData } from '../../charts/utils/dataUtils'
import { MiniChartWrapper } from './MiniChartWrapper'
import { UnifiedTooltip } from './UnifiedTooltip'

import styles from './compactPerformanceChart.module.scss'

const DEFAULT_THROUGHPUT_COLOR = 'var(--cyan-500)'
const DEFAULT_IOPS_COLOR = 'var(--aqua-500)'
const DEFAULT_LATENCY_COLOR = 'var(--orange-500)'

const INITIAL_TOOLTIP_STATE: TooltipState = {
  active: false,
  label: EMPTY_STRING,
  dataIndex: -1,
  viewportX: 0,
  viewportY: 0
}

const testId = (
  dataTestId: string | undefined,
  suffix: string
): string | undefined => (dataTestId ? `${dataTestId}-${suffix}` : undefined)

const hasRealData = (metric: CompactPerformanceMetricData): boolean =>
  !metric.isLoading && metric.hasValidData !== false && metric.data.length > 0

/**
 * Three syncId-synced mini charts (throughput, IOPS, avg. latency) with a
 * unified cross-chart hover tooltip. Prop-only: the caller supplies each
 * metric's data, formatter and label; the component aligns the three series
 * onto a common timeline internally so hovering one chart drives all three.
 */
export function CompactPerformanceChart({
  throughput,
  iops,
  latency,
  dataTestId
}: Readonly<CompactPerformanceChartProps>) {
  const [tooltipState, setTooltipState] = useState<TooltipState>(
    INITIAL_TOOLTIP_STATE
  )

  const syncId = useId()

  const throughputHasData = hasRealData(throughput)
  const iopsHasData = hasRealData(iops)
  const latencyHasData = hasRealData(latency)

  const liveSnapshot = useMemo(
    () => ({
      series: createCommonTimelineData(
        throughput.data,
        iops.data,
        latency.data
      ),
      hasData: {
        throughput: throughputHasData,
        iops: iopsHasData,
        latency: latencyHasData
      }
    }),
    [
      throughput.data,
      iops.data,
      latency.data,
      throughputHasData,
      iopsHasData,
      latencyHasData
    ]
  )

  /**
   * Freeze the aligned series and each metric's data-availability while the
   * tooltip is active.
   *
   * Recharts re-selects its active point from an unscaled, stored `chartX`
   * whenever it re-renders with a new `data` array and no accompanying mouse
   * event — under a page transform/scale this makes the cursor hop to a
   * neighboring point on every poll even though the mouse hasn't moved. Since
   * the live-polling `data` props change every few seconds, holding the last
   * pre-hover snapshot for as long as the tooltip stays active (instead of
   * feeding recharts the incoming data) keeps the inspected point stable;
   * resuming live data is instant once the tooltip deactivates. Freezing
   * `hasData` alongside the series keeps the tooltip from flipping a value to
   * or from its placeholder mid-hover when a poll changes a metric's state.
   *
   * This mirrors React's "adjusting state during render" pattern (comparing
   * against the previous render's value directly in the render body) rather
   * than a `useEffect`, so the frozen snapshot is committed in the very same
   * render that activates the tooltip — a later poll update can never sneak
   * in between activation and the freeze taking effect.
   */
  const [wasTooltipActive, setWasTooltipActive] = useState(
    tooltipState.active
  )
  const [frozenSnapshot, setFrozenSnapshot] = useState(liveSnapshot)
  if (tooltipState.active !== wasTooltipActive) {
    setWasTooltipActive(tooltipState.active)
    if (tooltipState.active) {
      setFrozenSnapshot(liveSnapshot)
    }
  }

  const activeSnapshot = tooltipState.active ? frozenSnapshot : liveSnapshot
  const { throughputData, iopsData, latencyData } = activeSnapshot.series

  const throughputColor = throughput.color ?? DEFAULT_THROUGHPUT_COLOR
  const iopsColor = iops.color ?? DEFAULT_IOPS_COLOR
  const latencyColor = latency.color ?? DEFAULT_LATENCY_COLOR

  const handleMouseLeave = useCallback(
    () => setTooltipState(INITIAL_TOOLTIP_STATE),
    []
  )

  return (
    <div
      className={styles.chartsContainer}
      data-testid={dataTestId}
      onMouseLeave={handleMouseLeave}
    >
      <MiniChartWrapper
        color={throughputColor}
        data={throughputData}
        dataTestId={testId(dataTestId, 'throughput')}
        formatValue={throughput.formatValue}
        hasData={throughputHasData}
        hasValidData={throughput.hasValidData}
        isHovered={tooltipState.active}
        isLoading={throughput.isLoading}
        label={throughput.label}
        onTooltipChange={setTooltipState}
        syncId={syncId}
      />
      <MiniChartWrapper
        color={iopsColor}
        data={iopsData}
        dataTestId={testId(dataTestId, 'iops')}
        formatValue={iops.formatValue}
        hasData={iopsHasData}
        hasValidData={iops.hasValidData}
        isHovered={tooltipState.active}
        isLoading={iops.isLoading}
        label={iops.label}
        onTooltipChange={setTooltipState}
        syncId={syncId}
      />
      <MiniChartWrapper
        color={latencyColor}
        data={latencyData}
        dataTestId={testId(dataTestId, 'latency')}
        formatValue={latency.formatValue}
        hasData={latencyHasData}
        hasValidData={latency.hasValidData}
        isHovered={tooltipState.active}
        isLoading={latency.isLoading}
        label={latency.label}
        onTooltipChange={setTooltipState}
        syncId={syncId}
      />
      {tooltipState.active ? (
        <UnifiedTooltip
          dataIndex={tooltipState.dataIndex}
          dataTestId={testId(dataTestId, 'tooltip')}
          label={tooltipState.label}
          viewportX={tooltipState.viewportX}
          viewportY={tooltipState.viewportY}
          metrics={[
            {
              data: throughputData,
              label: throughput.label,
              color: throughputColor,
              formatValue: throughput.formatValue,
              hasData: activeSnapshot.hasData.throughput
            },
            {
              data: iopsData,
              label: iops.label,
              color: iopsColor,
              formatValue: iops.formatValue,
              hasData: activeSnapshot.hasData.iops
            },
            {
              data: latencyData,
              label: latency.label,
              color: latencyColor,
              formatValue: latency.formatValue,
              hasData: activeSnapshot.hasData.latency
            }
          ]}
        />
      ) : null}
    </div>
  )
}
