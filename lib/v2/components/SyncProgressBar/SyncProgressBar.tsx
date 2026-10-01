import type { ReactNode } from 'react'

import clsx from 'clsx'

import { PERCENTAGE } from '#v2/utils/consts'

import styles from './syncProgressBar.module.scss'

const MIN_PERCENT = 0

export const SYNC_FILL_COLORS = {
  PURPLE: 'purple',
  ORANGE: 'orange',
  RED: 'red',
  GRAY: 'gray'
} as const

export type SyncFillColor =
  (typeof SYNC_FILL_COLORS)[keyof typeof SYNC_FILL_COLORS]

const FILL_CLASS_BY_COLOR: Record<SyncFillColor, string> = {
  [SYNC_FILL_COLORS.PURPLE]: styles.fillPurple,
  [SYNC_FILL_COLORS.ORANGE]: styles.fillOrange,
  [SYNC_FILL_COLORS.RED]: styles.fillRed,
  [SYNC_FILL_COLORS.GRAY]: styles.fillGray
}

export interface SyncProgressBarProps {
  percent: number
  /**
   * Freeform caption below the bar (e.g. "42%" or "42% · 366 MiB/s") — the consumer decides what, if anything, to show.
   * The caption slot is always rendered so rows with and without a caption keep the same height.
   */
  caption?: ReactNode
  /** Lets the fill follow the same status palette as the row's status chip (purple syncing, orange paused, red error). */
  fillColor?: SyncFillColor
  extraClass?: string
}

export function SyncProgressBar({
  percent,
  caption,
  fillColor = SYNC_FILL_COLORS.PURPLE,
  extraClass
}: Readonly<SyncProgressBarProps>) {
  const clampedPercent = Math.min(
    PERCENTAGE.FULL,
    Math.max(MIN_PERCENT, percent)
  )

  return (
    <div className={clsx(styles.container, extraClass)}>
      <div
        className={styles.track}
        data-testid='sync-progress-bar-track'
      >
        <div
          className={clsx(styles.fill, FILL_CLASS_BY_COLOR[fillColor])}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      <span
        className={styles.caption}
        data-testid='sync-progress-bar-caption'
      >
        {caption}
      </span>
    </div>
  )
}
