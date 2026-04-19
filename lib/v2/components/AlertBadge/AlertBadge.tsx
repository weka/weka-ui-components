import clsx from 'clsx'

import { SEVERITY_ICONS, WarningIcon } from '../../icons'
import type { Severity } from '../../utils/consts'

import styles from './alertBadge.module.scss'

export const ALERT_BADGE_VARIANTS = {
  ICON_WITH_NUMBER: 'iconWithNumber',
  ICON_ONLY: 'iconOnly'
} as const

export type AlertBadgeVariant =
  (typeof ALERT_BADGE_VARIANTS)[keyof typeof ALERT_BADGE_VARIANTS]

const MAX_ALERTS_NUM_TO_SHOW = 9

export const ALERT_BADGE_TEST_IDS = {
  ICON_ONLY: 'alert-badge-icon-only',
  ICON_WITH_NUMBER: 'alert-badge-icon-with-number'
} as const

export interface AlertBadgeProps {
  count?: number
  severity: Severity
  variant?: AlertBadgeVariant
  dataTestId?: string
}

export function AlertBadge({
  count = 0,
  severity,
  variant = ALERT_BADGE_VARIANTS.ICON_WITH_NUMBER,
  dataTestId
}: Readonly<AlertBadgeProps>) {
  const numIsTwoSymbols = count > MAX_ALERTS_NUM_TO_SHOW
  const displayCount = numIsTwoSymbols ? `${MAX_ALERTS_NUM_TO_SHOW}+` : count
  const severityIcon = SEVERITY_ICONS[severity] || <WarningIcon />

  if (variant === ALERT_BADGE_VARIANTS.ICON_ONLY) {
    return (
      <div
        className={clsx(styles.alertBadge, styles[severity], styles.iconOnly)}
        data-testid={
          dataTestId
            ? `${dataTestId}-icon-only`
            : ALERT_BADGE_TEST_IDS.ICON_ONLY
        }
      >
        {severityIcon}
      </div>
    )
  }

  return (
    <div
      className={clsx(
        styles.alertBadge,
        styles[severity],
        styles.iconWithNumber,
        { [styles.iconWithTwoNumbers]: numIsTwoSymbols }
      )}
      data-testid={
        dataTestId
          ? `${dataTestId}-icon-with-number`
          : ALERT_BADGE_TEST_IDS.ICON_WITH_NUMBER
      }
    >
      <span className={styles.icon}>{severityIcon}</span>
      <span className={styles.count}>{displayCount}</span>
    </div>
  )
}
