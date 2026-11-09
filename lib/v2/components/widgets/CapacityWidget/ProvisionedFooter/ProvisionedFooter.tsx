import type { FormattedCapacity } from '../capacityFormat'

import { PERCENTAGE } from '#v2/utils/consts'

import {
  clampPercentage,
  formatCapacity,
  formatPercentage,
  toPercentage
} from '../capacityFormat'
import { TotalPill } from '../TotalPill'

import styles from '../capacityWidget.module.scss'

export interface ProvisionedFooterProps {
  /** With OBS: Total Provisioned has no legend row, so it shows here. */
  showTotal: boolean
  totalLabel: string
  totalAmount: FormattedCapacity
  quotaLabel: string
  provisioned: number
  quota?: number
  quotaDisplay?: string
  unit: string
}

/**
 * Below the provisioned capsules: the Total Provisioned pill (with OBS) and
 * the quota with the share of it provisioned, as text and a thin bar. With
 * both, the share sits beside the bar in small text, since the OBS legend
 * leaves no room for a quota row of its own.
 */
export function ProvisionedFooter({
  showTotal,
  totalLabel,
  totalAmount,
  quotaLabel,
  provisioned,
  quota,
  quotaDisplay,
  unit
}: Readonly<ProvisionedFooterProps>) {
  if (quota === undefined) {
    return showTotal ? (
      <TotalPill
        amount={totalAmount}
        label={totalLabel}
      />
    ) : null
  }

  const quotaAmount = formatCapacity(quota, unit, quotaDisplay)
  const share = toPercentage(provisioned, quota)
  const fill = clampPercentage(share)

  const bar = (
    <div
      aria-label={quotaLabel}
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
  )

  if (showTotal) {
    return (
      <div className={styles.quotaFooter}>
        <TotalPill
          amount={totalAmount}
          label={totalLabel}
        />
        <div className={styles.quotaRow}>
          {bar}
          <span className={styles.quotaRowText}>
            {`${formatPercentage(share)} of ${quotaAmount.value} ${
              quotaAmount.unit
            }`}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.quotaFooter}>
      <div className={styles.quotaText}>
        <span className={styles.totalLabel}>{quotaLabel}</span>
        <span className={styles.totalValue}>
          <span className={styles.number}>{quotaAmount.value}</span>
          <span className={styles.unit}> {quotaAmount.unit}</span>
          <span className={styles.quotaShare}>
            {` (${formatPercentage(share)})`}
          </span>
        </span>
      </div>
      {bar}
    </div>
  )
}
