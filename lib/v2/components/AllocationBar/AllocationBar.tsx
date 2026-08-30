import clsx from 'clsx'

import { PERCENTAGE } from '#v2/utils/consts'

import { WarningCircleIcon } from '../../icons'

import styles from './allocationBar.module.scss'

export const ALLOCATION_SEGMENT_TONES = {
  USED: 'used',
  PRIMARY: 'primary',
  PRIMARY_LIGHT: 'primaryLight',
  FREE: 'free',
  ERROR: 'error'
} as const

export type AllocationSegmentTone =
  (typeof ALLOCATION_SEGMENT_TONES)[keyof typeof ALLOCATION_SEGMENT_TONES]

export interface AllocationBarSegment {
  id: string
  label: string
  value: number
  valueDisplay?: string
  tone: AllocationSegmentTone
}

export interface AllocationBarProps {
  segments: AllocationBarSegment[]
  total: number
  label?: string
  totalLabel?: string
  errorMessage?: string
  height?: number
  extraClass?: string
  dataTestId?: string
}

const DEFAULT_BAR_HEIGHT = 24
const ERROR_ICON_SIZE = 14

function getSliceWidths(
  segments: AllocationBarSegment[],
  total: number
): number[] {
  let remainingPercentage: number = PERCENTAGE.FULL
  return segments.map((segment) => {
    if (total <= 0 || segment.value <= 0) {
      return 0
    }
    const percentage = Math.min(
      (segment.value / total) * PERCENTAGE.FULL,
      remainingPercentage
    )
    remainingPercentage -= percentage
    return percentage
  })
}

/**
 * A multi-segment horizontal allocation bar with a legend, an optional
 * header row (label + right-aligned total), and an optional inline error
 * line. Prop-only: values are plain numbers and display strings are
 * supplied pre-formatted by the caller. Segments with the FREE tone appear
 * in the legend only — the bar track itself represents free space.
 */
export function AllocationBar({
  segments,
  total,
  label,
  totalLabel,
  errorMessage,
  height = DEFAULT_BAR_HEIGHT,
  extraClass,
  dataTestId
}: Readonly<AllocationBarProps>) {
  const barSegments = segments.filter(
    (segment) => segment.tone !== ALLOCATION_SEGMENT_TONES.FREE
  )
  const sliceWidths = getSliceWidths(barSegments, total)

  return (
    <div
      className={clsx(styles.allocationBar, extraClass)}
      data-testid={dataTestId}
    >
      {label || totalLabel ? (
        <div className={styles.headerRow}>
          {label ? <span className={styles.label}>{label}</span> : null}
          {totalLabel ? (
            <span className={styles.totalLabel}>{totalLabel}</span>
          ) : null}
        </div>
      ) : null}
      <div
        className={styles.track}
        style={{ height: `${height}px` }}
      >
        {barSegments.map((segment, index) =>
          sliceWidths[index] > 0 ? (
            <div
              key={segment.id}
              className={clsx(styles.slice, styles[segment.tone])}
              style={{ width: `${sliceWidths[index]}%` }}
              data-testid={
                dataTestId ? `${dataTestId}-segment-${segment.id}` : undefined
              }
            />
          ) : null
        )}
      </div>
      <div className={styles.legend}>
        {segments.map((segment) => (
          <div
            key={segment.id}
            className={styles.legendItem}
            data-testid={
              dataTestId ? `${dataTestId}-legend-${segment.id}` : undefined
            }
          >
            <span className={clsx(styles.legendDot, styles[segment.tone])} />
            <span className={styles.legendLabel}>{segment.label}</span>
            {segment.valueDisplay ? (
              <span className={styles.legendValue}>{segment.valueDisplay}</span>
            ) : null}
          </div>
        ))}
      </div>
      {errorMessage ? (
        <div
          className={styles.errorMessage}
          data-testid={dataTestId ? `${dataTestId}-error` : undefined}
          role='alert'
        >
          <span className={styles.errorIcon}>
            <WarningCircleIcon
              filled
              size={ERROR_ICON_SIZE}
            />
          </span>
          {errorMessage}
        </div>
      ) : null}
    </div>
  )
}
