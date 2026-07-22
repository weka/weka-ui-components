import type { CompactPerformanceChartProps, TooltipState } from './types'

import { useMemo, useState } from 'react'

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

  const liveSeries = useMemo(
    () => createCommonTimelineData(throughput.data, iops.data, latency.data),
    [throughput.data, iops.data, latency.data]
  )

  /**
   * Freeze the aligned series while the tooltip is active.
   *
   * Recharts re-selects its active point from an unscaled, stored `chartX`
   * whenever it re-renders with a new `data` array and no accompanying mouse
   * event — under a page transform/scale this makes the cursor hop to a
   * neighboring point on every poll even though the mouse hasn't moved. Since
   * the live-polling `data` props change every few seconds, holding the last
   * pre-hover snapshot for as long as the tooltip stays active (instead of
   * feeding recharts the incoming data) keeps the inspected point stable;
   * resuming live data is instant once the tooltip deactivates.
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
  const [frozenSeries, setFrozenSeries] = useState(liveSeries)
  if (tooltipState.active !== wasTooltipActive) {
    setWasTooltipActive(tooltipState.active)
    if (tooltipState.active) {
      setFrozenSeries(liveSeries)
    }
  }

  const { throughputData, iopsData, latencyData } = tooltipState.active
    ? frozenSeries
    : liveSeries

  const throughputColor = throughput.color ?? DEFAULT_THROUGHPUT_COLOR
  const iopsColor = iops.color ?? DEFAULT_IOPS_COLOR
  const latencyColor = latency.color ?? DEFAULT_LATENCY_COLOR

  return (
    <div
      className={styles.chartsContainer}
      data-testid={dataTestId}
    >
      <MiniChartWrapper
        color={throughputColor}
        data={throughputData}
        dataTestId={testId(dataTestId, 'throughput')}
        formatValue={throughput.formatValue}
        hasValidData={throughput.hasValidData}
        isHovered={tooltipState.active}
        isLoading={throughput.isLoading}
        label={throughput.label}
        onTooltipChange={setTooltipState}
      />
      <MiniChartWrapper
        color={iopsColor}
        data={iopsData}
        dataTestId={testId(dataTestId, 'iops')}
        formatValue={iops.formatValue}
        hasValidData={iops.hasValidData}
        isHovered={tooltipState.active}
        isLoading={iops.isLoading}
        label={iops.label}
        onTooltipChange={setTooltipState}
      />
      <MiniChartWrapper
        color={latencyColor}
        data={latencyData}
        dataTestId={testId(dataTestId, 'latency')}
        formatValue={latency.formatValue}
        hasValidData={latency.hasValidData}
        isHovered={tooltipState.active}
        isLoading={latency.isLoading}
        label={latency.label}
        onTooltipChange={setTooltipState}
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
              formatValue: throughput.formatValue
            },
            {
              data: iopsData,
              label: iops.label,
              color: iopsColor,
              formatValue: iops.formatValue
            },
            {
              data: latencyData,
              label: latency.label,
              color: latencyColor,
              formatValue: latency.formatValue
            }
          ]}
        />
      ) : null}
    </div>
  )
}
