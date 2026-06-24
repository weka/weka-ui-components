import clsx from 'clsx'

import styles from './alertStatusChip.module.scss'

export const ALERT_STATUSES = {
  ACTIVE: 'active',
  CLOSED: 'closed'
} as const

export type AlertStatus = (typeof ALERT_STATUSES)[keyof typeof ALERT_STATUSES]

export const ALERT_STATUS_CHIP_VARIANTS = {
  STANDALONE: 'standalone',
  OVERLAY: 'overlay'
} as const

export type AlertStatusChipVariant =
  (typeof ALERT_STATUS_CHIP_VARIANTS)[keyof typeof ALERT_STATUS_CHIP_VARIANTS]

export interface AlertStatusChipLabels {
  active: string
  closed: string
}

const DEFAULT_LABELS: AlertStatusChipLabels = {
  active: 'Active',
  closed: 'Closed'
}

export interface AlertStatusChipProps {
  status: AlertStatus
  variant?: AlertStatusChipVariant
  labels?: Partial<AlertStatusChipLabels>
  dataTestId?: string
}

export function AlertStatusChip({
  status,
  variant = ALERT_STATUS_CHIP_VARIANTS.STANDALONE,
  labels,
  dataTestId = 'alert-status-chip'
}: Readonly<AlertStatusChipProps>) {
  const text = { ...DEFAULT_LABELS, ...labels }
  const isClosed = status === ALERT_STATUSES.CLOSED

  return (
    <span
      className={clsx(styles.chip, styles[status], styles[variant])}
      data-testid={dataTestId}
    >
      <span className={isClosed ? styles.ringDot : styles.dot} />
      <span>{isClosed ? text.closed : text.active}</span>
    </span>
  )
}
