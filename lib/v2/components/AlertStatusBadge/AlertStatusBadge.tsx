import type { Severity } from '#v2/utils/consts'

import clsx from 'clsx'

import {
  ALERT_LIMITS,
  ALERT_STATUS_BADGE_SIZES,
  type AlertStatusBadgeSize,
  normalizeSeverity,
  SEVERITY_CONFIG
} from '../AlertBadge'
import { SeverityIcon } from '../AlertBadge'

import styles from './alertStatusBadge.module.scss'

export { ALERT_STATUS_BADGE_SIZES, type AlertStatusBadgeSize }

export interface AlertStatusBadgeProps {
  severity: Severity | string
  startTime?: string
  size?: AlertStatusBadgeSize
}

export function AlertStatusBadge({
  severity,
  startTime,
  size = ALERT_STATUS_BADGE_SIZES.LARGE
}: Readonly<AlertStatusBadgeProps>) {
  const displaySeverity = normalizeSeverity(severity)
  const config = SEVERITY_CONFIG[displaySeverity]
  const iconSize =
    size === ALERT_STATUS_BADGE_SIZES.SMALL
      ? ALERT_LIMITS.ALERT_STATUS_ICON_SIZE_SMALL
      : ALERT_LIMITS.ALERT_STATUS_ICON_SIZE_LARGE

  return (
    <div className={clsx(styles.statusBadge, styles[size])}>
      <span className={clsx(styles.statusIcon, config.className)}>
        <SeverityIcon
          severity={displaySeverity}
          size={iconSize}
        />
      </span>
      <span className={styles.statusLabel}>{config.label}</span>
      {startTime ? (
        <span className={styles.statusTime}>{startTime}</span>
      ) : null}
    </div>
  )
}
