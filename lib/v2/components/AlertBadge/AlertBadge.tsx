import type { Severity } from '#v2/utils/consts'

import clsx from 'clsx'

import {
  ALERT_BADGE_TEST_IDS,
  ALERT_BADGE_VARIANTS,
  ALERT_LIMITS,
  type AlertBadgeVariant,
  normalizeSeverity,
  SEVERITY_CONFIG
} from './severityConfig'
import { SeverityIcon } from './SeverityIcon'

import styles from './alertBadge.module.scss'

export { ALERT_BADGE_TEST_IDS, ALERT_BADGE_VARIANTS, type AlertBadgeVariant }

export interface AlertBadgeProps {
  count?: number
  severity: Severity | string
  variant?: AlertBadgeVariant
  dataTestId?: string
}

export function AlertBadge({
  count = 0,
  severity,
  variant = ALERT_BADGE_VARIANTS.ICON_WITH_NUMBER,
  dataTestId
}: Readonly<AlertBadgeProps>) {
  const displaySeverity = normalizeSeverity(severity)
  const countExceedsLimit = count > ALERT_LIMITS.MAX_ALERTS_NUM_TO_SHOW
  const displayCount = countExceedsLimit
    ? `${ALERT_LIMITS.MAX_ALERTS_NUM_TO_SHOW}+`
    : count
  const config = SEVERITY_CONFIG[displaySeverity]

  if (variant === ALERT_BADGE_VARIANTS.ICON_ONLY) {
    return (
      <div
        className={clsx(styles.alertBadge, config.className, styles.iconOnly)}
        data-testid={
          dataTestId
            ? `${dataTestId}-icon-only`
            : ALERT_BADGE_TEST_IDS.ICON_ONLY
        }
      >
        <span className={styles.icon}>
          <SeverityIcon
            severity={displaySeverity}
            size={ALERT_LIMITS.ALERT_BADGE_ICON_SIZE}
          />
        </span>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        styles.alertBadge,
        config.className,
        styles.iconWithNumber,
        { [styles.iconWithTwoNumbers]: countExceedsLimit }
      )}
      data-testid={
        dataTestId
          ? `${dataTestId}-icon-with-number`
          : ALERT_BADGE_TEST_IDS.ICON_WITH_NUMBER
      }
    >
      <span className={styles.icon}>
        <SeverityIcon
          severity={displaySeverity}
          size={ALERT_LIMITS.ALERT_BADGE_COUNTER_ICON_SIZE}
        />
      </span>
      <span className={styles.count}>{displayCount}</span>
    </div>
  )
}
