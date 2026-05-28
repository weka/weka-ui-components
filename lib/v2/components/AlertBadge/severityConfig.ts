import type { Severity } from '#v2/utils/consts'

import { SEVERITY_LABELS, SEVERITY_TYPES } from '#v2/utils/consts'

import styles from './alertBadge.module.scss'

export const ALERT_BADGE_VARIANTS = {
  ICON_WITH_NUMBER: 'iconWithNumber',
  ICON_ONLY: 'iconOnly'
} as const

export type AlertBadgeVariant =
  (typeof ALERT_BADGE_VARIANTS)[keyof typeof ALERT_BADGE_VARIANTS]

export const ALERT_STATUS_BADGE_SIZES = {
  SMALL: 'small',
  LARGE: 'large'
} as const

export type AlertStatusBadgeSize =
  (typeof ALERT_STATUS_BADGE_SIZES)[keyof typeof ALERT_STATUS_BADGE_SIZES]

export const ALERT_BADGE_TEST_IDS = {
  ICON_ONLY: 'alert-badge-icon-only',
  ICON_WITH_NUMBER: 'alert-badge-icon-with-number'
} as const

export const ALERT_LIMITS = {
  MAX_ALERTS_NUM_TO_SHOW: 9,
  ALERT_BADGE_ICON_SIZE: 16,
  ALERT_BADGE_COUNTER_ICON_SIZE: 14,
  ALERT_STATUS_ICON_SIZE_SMALL: 24,
  ALERT_STATUS_ICON_SIZE_LARGE: 48
} as const

export const SEVERITY_ICON_TYPES = {
  CIRCLE: 'circle',
  DIAMOND: 'diamond',
  TRIANGLE: 'triangle'
} as const

export type SeverityIconType =
  (typeof SEVERITY_ICON_TYPES)[keyof typeof SEVERITY_ICON_TYPES]

interface SeverityConfigEntry {
  className: string
  textColorClassName: string
  iconType: SeverityIconType
  label: string
}

export const SEVERITY_CONFIG: Record<Severity, SeverityConfigEntry> = {
  [SEVERITY_TYPES.CRITICAL]: {
    className: styles.critical,
    textColorClassName: styles.criticalText,
    iconType: SEVERITY_ICON_TYPES.TRIANGLE,
    label: SEVERITY_LABELS[SEVERITY_TYPES.CRITICAL]
  },
  [SEVERITY_TYPES.MAJOR]: {
    className: styles.major,
    textColorClassName: styles.majorText,
    iconType: SEVERITY_ICON_TYPES.CIRCLE,
    label: SEVERITY_LABELS[SEVERITY_TYPES.MAJOR]
  },
  [SEVERITY_TYPES.MINOR]: {
    className: styles.minor,
    textColorClassName: styles.minorText,
    iconType: SEVERITY_ICON_TYPES.TRIANGLE,
    label: SEVERITY_LABELS[SEVERITY_TYPES.MINOR]
  },
  [SEVERITY_TYPES.WARNING]: {
    className: styles.warning,
    textColorClassName: styles.warningText,
    iconType: SEVERITY_ICON_TYPES.DIAMOND,
    label: SEVERITY_LABELS[SEVERITY_TYPES.WARNING]
  },
  [SEVERITY_TYPES.INFO]: {
    className: styles.info,
    textColorClassName: styles.infoText,
    iconType: SEVERITY_ICON_TYPES.CIRCLE,
    label: SEVERITY_LABELS[SEVERITY_TYPES.INFO]
  },
  [SEVERITY_TYPES.DEBUG]: {
    className: styles.info,
    textColorClassName: styles.infoText,
    iconType: SEVERITY_ICON_TYPES.CIRCLE,
    label: SEVERITY_LABELS[SEVERITY_TYPES.DEBUG]
  },
  [SEVERITY_TYPES.DEFAULT]: {
    className: styles.info,
    textColorClassName: styles.infoText,
    iconType: SEVERITY_ICON_TYPES.CIRCLE,
    label: SEVERITY_LABELS[SEVERITY_TYPES.DEFAULT]
  }
}

export function normalizeSeverity(severity?: string): Severity {
  const severityKey = severity?.toLowerCase() as Severity | undefined
  return severityKey && severityKey in SEVERITY_CONFIG
    ? severityKey
    : SEVERITY_TYPES.DEFAULT
}
