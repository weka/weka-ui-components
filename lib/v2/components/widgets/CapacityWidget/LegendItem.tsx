import type { FormattedCapacity } from './capacityFormat'

import clsx from 'clsx'

import styles from './capacityWidget.module.scss'

export interface LegendItemProps {
  label: string
  amount: FormattedCapacity
  dotClass?: string
  className?: string
}

export function LegendItem({
  label,
  amount,
  dotClass,
  className
}: Readonly<LegendItemProps>) {
  return (
    <div className={clsx(styles.legendItem, className)}>
      <div className={styles.legendLabel}>
        {dotClass ? <span className={clsx(styles.dot, dotClass)} /> : null}
        {label}
      </div>
      <div className={styles.legendValue}>
        <span className={styles.number}>{amount.value}</span>
        <span className={styles.unit}> {amount.unit}</span>
      </div>
    </div>
  )
}
