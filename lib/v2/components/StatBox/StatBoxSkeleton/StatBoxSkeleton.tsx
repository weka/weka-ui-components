import clsx from 'clsx'

import { STAT_BOX_STATUS, type StatBoxStatus } from '../statBoxConstants'

import styles from '../statBox.module.scss'

interface StatBoxSkeletonProps {
  status: StatBoxStatus
  showSubStats: boolean
}

/**
 * Loading/error placeholder for a StatBox. Like SubStat, its pulse/error
 * styling lives in the parent `statBox.module.scss`, so it shares that module
 * instead of owning one.
 */
export function StatBoxSkeleton({
  status,
  showSubStats
}: Readonly<StatBoxSkeletonProps>) {
  const variant =
    status === STAT_BOX_STATUS.ERROR
      ? STAT_BOX_STATUS.ERROR
      : STAT_BOX_STATUS.LOADING

  return (
    <div
      aria-busy={status === STAT_BOX_STATUS.LOADING}
      className={styles.skeletonContent}
      data-testid={`stat-box-skeleton-${variant}`}
    >
      <div className={clsx(styles.skeletonMain, styles[variant])} />
      {showSubStats ? (
        <div className={styles.skeletonSubStats}>
          <div className={clsx(styles.skeletonSub, styles[variant])} />
          <div className={clsx(styles.skeletonSub, styles[variant])} />
        </div>
      ) : null}
    </div>
  )
}
