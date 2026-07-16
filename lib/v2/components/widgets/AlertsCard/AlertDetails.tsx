import clsx from 'clsx'

import { EMPTY_STRING, type Severity, SEVERITY_TYPES } from '#v2/utils/consts'

import { MuteIcon, UnmuteIcon } from '../../../icons'
import {
  ALERT_STATUS_BADGE_SIZES,
  AlertStatusBadge,
  type AlertStatusBadgeSize
} from '../../AlertStatusBadge'
import { type AlertStatus, AlertStatusChip } from '../../AlertStatusChip'
import { CollapsibleText } from '../../CollapsibleText'
import { type GroupedAlert, RelatedAlertsTable } from './RelatedAlertsTable'

import styles from './alertDetails.module.scss'

const MUTED_ICON_SIZE = 14

const identityTimestamp = (timestamp: string) => timestamp

export interface AlertDetailsData {
  title?: string
  content?: string
  severity: Severity | string
  timestamp: string
  count?: number
  type?: string
  action?: string
  muted?: boolean
  groupedAlerts?: GroupedAlert[]
}

export interface AlertDetailsLabels {
  relatedAlerts: string
  startTime: string
  type: string
  muted: string
  yes: string
  no: string
  description: string
  recommendedAction: string
}

const DEFAULT_LABELS: AlertDetailsLabels = {
  relatedAlerts: 'Related Alerts',
  startTime: 'Start time',
  type: 'Type',
  muted: 'Muted',
  yes: 'Yes',
  no: 'No',
  description: 'Description',
  recommendedAction: 'Recommended Action'
}

export interface AlertDetailsProps {
  alert: AlertDetailsData
  status?: AlertStatus
  showStatus?: boolean
  bannerSize?: AlertStatusBadgeSize
  formatTimestamp?: (timestamp: string) => string
  labels?: Partial<AlertDetailsLabels>
}

export function AlertDetails({
  alert,
  status = 'active',
  showStatus = true,
  bannerSize = ALERT_STATUS_BADGE_SIZES.LARGE,
  formatTimestamp = identityTimestamp,
  labels
}: Readonly<AlertDetailsProps>) {
  const text = { ...DEFAULT_LABELS, ...labels }
  const sev = (alert.severity?.toLowerCase?.() ||
    SEVERITY_TYPES.DEFAULT) as Severity
  const isCompactBanner = bannerSize === ALERT_STATUS_BADGE_SIZES.SMALL

  return (
    <div className={styles.container}>
      <div
        className={clsx(styles.statusRow, styles[sev], {
          [styles.compact]: isCompactBanner
        })}
      >
        <AlertStatusBadge
          severity={sev}
          size={bannerSize}
        />
        <div className={styles.flexContainer}>
          {showStatus ? (
            <div className={styles.statusBadges}>
              <AlertStatusChip
                status={status}
                variant='overlay'
              />
            </div>
          ) : null}
          {alert.count && alert.count > 1 ? (
            <div className={styles.groupedAlertsSection}>
              <div className={styles.sectionTitle}>{text.relatedAlerts}</div>
              <div
                className={clsx(styles.sectionValue, styles.statusValueBold)}
              >
                {alert.count}
              </div>
            </div>
          ) : null}
        </div>
        <div className={styles.startTimeSection}>
          <div className={styles.sectionTitle}>{text.startTime}</div>
          <div className={clsx(styles.sectionValue, styles.statusValueBold)}>
            {formatTimestamp(alert.timestamp)}
          </div>
        </div>
      </div>
      <div className={styles.typeRow}>
        <div>
          <div className={styles.sectionTitle}>{text.type}</div>
          <div className={styles.sectionValue}>{alert.type}</div>
        </div>
        <div>
          <div className={styles.sectionTitle}>{text.muted}</div>
          <div className={styles.sectionValue}>
            {alert.muted ? (
              <MuteIcon
                height={MUTED_ICON_SIZE}
                width={MUTED_ICON_SIZE}
              />
            ) : (
              <UnmuteIcon
                height={MUTED_ICON_SIZE}
                width={MUTED_ICON_SIZE}
              />
            )}
            <span>{alert.muted ? text.yes : text.no}</span>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.sectionTitle}>{text.description}</div>
        <CollapsibleText text={alert.content || EMPTY_STRING} />
      </div>
      {alert.action ? (
        <div>
          <div className={styles.sectionTitle}>{text.recommendedAction}</div>
          <CollapsibleText text={alert.action} />
        </div>
      ) : null}
      <RelatedAlertsTable
        formatTimestamp={formatTimestamp}
        groupedAlerts={alert.groupedAlerts}
        label={text.relatedAlerts}
      />
    </div>
  )
}
