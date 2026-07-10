import clsx from 'clsx'

import { STAT_BOX_STATUS, type StatBoxProps } from './statBoxConstants'
import { StatBoxSkeleton } from './StatBoxSkeleton'
import { SubStat } from './SubStat'

import styles from './statBox.module.scss'

export function StatBox({
  title,
  colorVariant,
  mainValue,
  mainUnit,
  mainValueAdornment,
  subStats,
  status = STAT_BOX_STATUS.READY,
  dataTestId
}: Readonly<StatBoxProps>) {
  const isSkeleton =
    status === STAT_BOX_STATUS.LOADING || status === STAT_BOX_STATUS.ERROR

  const content = (
    <>
      {mainUnit || mainValueAdornment ? (
        <div className={styles.mainValueGroup}>
          <span className={styles.mainValue}>{mainValue}</span>
          {mainUnit ? (
            <span className={styles.mainUnit}>{mainUnit}</span>
          ) : null}
          {mainValueAdornment ? (
            <span className={styles.mainValueAdornment}>
              {mainValueAdornment}
            </span>
          ) : null}
        </div>
      ) : (
        <span className={styles.mainValue}>{mainValue}</span>
      )}
      {subStats?.length ? (
        <div className={styles.subStats}>
          {subStats.map((subStat) => (
            <SubStat
              key={subStat.label}
              label={subStat.label}
              unit={subStat.unit}
              value={subStat.value}
            />
          ))}
        </div>
      ) : null}
    </>
  )

  return (
    <div
      className={styles.statBox}
      data-testid={dataTestId ? `stat-box-${dataTestId}` : undefined}
    >
      <div className={styles.statTitle}>{title}</div>
      <div className={clsx(styles.statContent, styles[colorVariant])}>
        {isSkeleton ? (
          <StatBoxSkeleton
            showSubStats={Boolean(subStats?.length)}
            status={status}
          />
        ) : (
          content
        )}
      </div>
    </div>
  )
}
