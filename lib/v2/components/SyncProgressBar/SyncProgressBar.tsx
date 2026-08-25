import type { ReactNode } from 'react'

import clsx from 'clsx'

import { PERCENTAGE } from '#v2/utils/consts'

import styles from './syncProgressBar.module.scss'

const MIN_PERCENT = 0

export interface SyncProgressBarProps {
  percent: number
  /** Freeform caption below the bar (e.g. "42%" or "42% · 366 MiB/s") — the consumer decides what, if anything, to show. */
  caption?: ReactNode
  extraClass?: string
}

export function SyncProgressBar({
  percent,
  caption,
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
          className={styles.fill}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      {caption ? <span className={styles.caption}>{caption}</span> : null}
    </div>
  )
}
