import type { ComponentProps } from 'react'
import type { AreaChart } from 'recharts'

import { MiniAreaChart } from './MiniAreaChart'

import styles from './miniChart.module.scss'

type AreaChartProps = ComponentProps<typeof AreaChart>

const DEFAULT_HEIGHT = 50

export interface MiniChartDataPoint {
  time: string
  value: number
}

export interface MiniChartProps {
  /** Title shown below the chart. Omit to render no label (caller supplies it). */
  title?: string
  data: MiniChartDataPoint[]
  color: string
  /** Formats the floating last-value label (default: the raw number). */
  formatValue?: (value: number) => string
  height?: number
  isLoading?: boolean
  hasValidData?: boolean
  /** Hide the floating last-value (e.g. while an external tooltip is shown). */
  hideLastValue?: boolean
  /** recharts sync group — charts sharing a syncId share the hover cursor. */
  syncId?: string
  /** Forwarded to the underlying recharts chart for external hover handling. */
  onMouseMove?: AreaChartProps['onMouseMove']
  onMouseLeave?: AreaChartProps['onMouseLeave']
  dataTestId?: string
}

/**
 * A single gradient-filled area line with its title and a floating last-value
 * label. Prop-only: the caller supplies `{ time, value }[]` and an optional
 * `formatValue` for the last-value display. Charts sharing a `syncId` sync
 * their hover cursor; `onMouseMove`/`onMouseLeave` forward to recharts for an
 * external tooltip, and `hideLastValue` hides the badge while it shows.
 */
export function MiniChart({
  title,
  data,
  color,
  formatValue = String,
  height = DEFAULT_HEIGHT,
  isLoading = false,
  hasValidData = true,
  hideLastValue = false,
  syncId,
  onMouseMove,
  onMouseLeave,
  dataTestId
}: Readonly<MiniChartProps>) {
  const lastValue = data[data.length - 1]?.value ?? 0
  const showLastValue = hasValidData && !hideLastValue && !isLoading

  return (
    <div
      className={styles.miniChart}
      data-testid={dataTestId}
    >
      <div className={styles.chartWrapper}>
        {isLoading ? (
          <div
            className={styles.loading}
            data-testid={dataTestId ? `${dataTestId}-loading` : undefined}
          />
        ) : (
          <MiniAreaChart
            color={color}
            data={data}
            hasValidData={hasValidData}
            height={height}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            syncId={syncId}
          />
        )}
        {showLastValue ? (
          <div
            className={styles.currentValue}
            data-testid={dataTestId ? `${dataTestId}-value` : undefined}
          >
            {formatValue(lastValue)}
          </div>
        ) : null}
      </div>
      {title ? (
        <div
          className={styles.label}
          data-testid={dataTestId ? `${dataTestId}-label` : undefined}
        >
          {title}
        </div>
      ) : null}
    </div>
  )
}
