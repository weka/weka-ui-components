import clsx from 'clsx'

import { PERCENTAGE } from '../../utils/consts'

import styles from './capacityProgressBar.module.scss'

export interface CapacityProgressBarProps {
  percentage: number
  height?: number
  showPercentageText?: boolean
  borderRadius?: number
  extraClass?: string
}

export const CAPACITY_FILL_COLORS = {
  CYAN: 'cyan',
  ORANGE: 'orange',
  RED: 'red'
} as const

export type CapacityFillColor =
  (typeof CAPACITY_FILL_COLORS)[keyof typeof CAPACITY_FILL_COLORS]

const CAPACITY_THRESHOLDS = {
  WARNING: 75,
  CRITICAL: 95
} as const

function getFillColor(percentage: number): CapacityFillColor {
  if (percentage <= CAPACITY_THRESHOLDS.WARNING) {
    return CAPACITY_FILL_COLORS.CYAN
  }
  if (percentage <= CAPACITY_THRESHOLDS.CRITICAL) {
    return CAPACITY_FILL_COLORS.ORANGE
  }
  return CAPACITY_FILL_COLORS.RED
}

export function CapacityProgressBar({
  percentage,
  height = 24,
  showPercentageText = false,
  borderRadius = 20,
  extraClass
}: Readonly<CapacityProgressBarProps>) {
  const fillColor = getFillColor(percentage)
  const clampedPercentage = Math.min(percentage, PERCENTAGE.FULL)

  return (
    <div
      className={clsx(styles.progressBar, extraClass)}
      style={{ height: `${height}px`, borderRadius: `${borderRadius}px` }}
    >
      <div
        className={clsx(
          styles.progressFill,
          styles[
            `fill${fillColor.charAt(0).toUpperCase() + fillColor.slice(1)}`
          ]
        )}
        style={{
          width: `${clampedPercentage}%`,
          borderRadius: `${borderRadius}px 0 0 ${borderRadius}px`
        }}
      />
      {showPercentageText ? (
        <div className={styles.percentageText}>
          {percentage === PERCENTAGE.FULL
            ? '100%'
            : `${percentage.toFixed(1)}%`}
        </div>
      ) : null}
    </div>
  )
}
