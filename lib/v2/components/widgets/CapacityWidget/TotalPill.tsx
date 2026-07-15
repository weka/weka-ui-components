import type { FormattedCapacity } from './capacityFormat'

import styles from './capacityWidget.module.scss'

export interface TotalPillProps {
  label: string
  amount: FormattedCapacity
}

export function TotalPill({ label, amount }: Readonly<TotalPillProps>) {
  return (
    <div className={styles.totalPill}>
      <span className={styles.totalLabel}>{label}</span>
      <span className={styles.totalValue}>
        <span className={styles.number}>{amount.value}</span>
        <span className={styles.unit}> {amount.unit}</span>
      </span>
    </div>
  )
}
