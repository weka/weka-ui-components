import { PERCENTAGE } from '#v2/utils/consts'

import {
  clampPercentage,
  formatCapacity,
  formatPercentage,
  toPercentage
} from '../capacityFormat'

import styles from '../capacityWidget.module.scss'

export interface QuotaFooterProps {
  label: string
  provisioned: number
  /** Nothing is drawn without one. */
  quota?: number
  unit: string
  quotaDisplay?: string
}

/** The quota and the share of it provisioned, as text and as a thin bar. */
export function QuotaFooter({
  label,
  provisioned,
  quota,
  unit,
  quotaDisplay
}: Readonly<QuotaFooterProps>) {
  if (quota === undefined) {
    return null
  }

  const amount = formatCapacity(quota, unit, quotaDisplay)
  const share = toPercentage(provisioned, quota)
  const fill = clampPercentage(share)

  return (
    <div className={styles.quotaFooter}>
      <div className={styles.quotaText}>
        <span className={styles.totalLabel}>{label}</span>
        <span className={styles.totalValue}>
          <span className={styles.number}>{amount.value}</span>
          <span className={styles.unit}> {amount.unit}</span>
          <span className={styles.quotaShare}>
            {' '}
            ({formatPercentage(share)})
          </span>
        </span>
      </div>
      <div
        aria-label={label}
        aria-valuemax={PERCENTAGE.FULL}
        aria-valuemin={0}
        aria-valuenow={Math.round(fill)}
        className={styles.quotaBar}
        role='progressbar'
      >
        <div
          className={styles.quotaFill}
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  )
}
