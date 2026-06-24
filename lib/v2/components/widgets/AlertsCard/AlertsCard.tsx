import type { SimpleTableColumn, SimpleTableTab } from '../../SimpleTable'

import { useMemo, useState } from 'react'

import {
  EMPTY_STRING,
  type Severity,
  SEVERITY_LABELS,
  SEVERITY_TYPES
} from '#v2/utils/consts'

import { MuteIcon } from '../../../icons'
import { ALERT_BADGE_VARIANTS, AlertBadge } from '../../AlertBadge'
import { SimpleTable } from '../../SimpleTable'
import { Tooltip } from '../../Tooltip'
import {
  ALERT_SORT_FIELDS,
  ALERT_TAB_TYPES,
  type AlertItem,
  type AlertSortField,
  type AlertTabType,
  buildAlertRows,
  formatRelativeTime,
  SORT_ORDERS,
  type SortOrder
} from './alertsCardUtils'

import styles from './alertsCard.module.scss'

const ROW_MAX_HEIGHT = 250

export interface AlertsCardLabels {
  system: string
  custom: string
  muted: string
  noSystemAlerts: string
  noCustomAlerts: string
}

const DEFAULT_LABELS: AlertsCardLabels = {
  system: 'System',
  custom: 'Custom',
  muted: 'Muted',
  noSystemAlerts: 'No System Alerts',
  noCustomAlerts: 'No Custom Alerts'
}

export interface AlertsCardProps {
  alerts: AlertItem[]
  sortField?: AlertSortField
  sortOrder?: SortOrder
  showMuted?: boolean
  showTabs?: boolean
  labels?: Partial<AlertsCardLabels>
  formatTimestamp?: (timestamp: string) => string
  onAlertClick?: (alert: AlertItem) => void
  dataTestId?: string
}

function renderSeverityIcon(severity: string) {
  const severityKey = (severity?.toLowerCase?.() ||
    SEVERITY_TYPES.DEFAULT) as Severity
  return (
    <Tooltip data={SEVERITY_LABELS[severityKey] || SEVERITY_LABELS.default}>
      <AlertBadge
        severity={severityKey}
        variant={ALERT_BADGE_VARIANTS.ICON_ONLY}
      />
    </Tooltip>
  )
}

export function AlertsCard({
  alerts,
  sortField = ALERT_SORT_FIELDS.DATE,
  sortOrder = SORT_ORDERS.DESC,
  showMuted = false,
  showTabs = true,
  labels,
  formatTimestamp = formatRelativeTime,
  onAlertClick,
  dataTestId
}: Readonly<AlertsCardProps>) {
  const text = { ...DEFAULT_LABELS, ...labels }
  const [tab, setTab] = useState<AlertTabType>(ALERT_TAB_TYPES.SYSTEM)

  const rows = useMemo(
    () => buildAlertRows({ alerts, tab, showMuted, sortField, sortOrder }),
    [alerts, tab, showMuted, sortField, sortOrder]
  )

  const columns: SimpleTableColumn<AlertItem>[] = [
    {
      key: 'icon',
      width: '28px',
      className: styles.icon,
      render: (alert) => renderSeverityIcon(alert.severity)
    },
    {
      key: 'description',
      className: styles.description,
      render: (alert) => (
        <>
          <Tooltip
            data={alert.title || alert.content || EMPTY_STRING}
            ellipsis
          >
            <span className={styles.text}>{alert.title || alert.content}</span>
          </Tooltip>
          {alert.count ? (
            <span className={styles.count}>[{alert.count}]</span>
          ) : null}
          {alert.muted ? (
            <Tooltip data={text.muted}>
              <MuteIcon extraClass={styles.mutedIcon} />
            </Tooltip>
          ) : null}
        </>
      )
    },
    {
      key: 'time',
      width: 'auto',
      className: styles.time,
      render: (alert) => formatTimestamp(alert.timestamp)
    }
  ]

  const tabs: SimpleTableTab[] = [
    { id: ALERT_TAB_TYPES.SYSTEM, label: text.system },
    { id: ALERT_TAB_TYPES.CUSTOM, label: text.custom }
  ]

  const emptyMessage =
    tab === ALERT_TAB_TYPES.SYSTEM ? text.noSystemAlerts : text.noCustomAlerts

  return (
    <div
      className={styles.container}
      data-testid={dataTestId}
    >
      <SimpleTable
        activeTab={tab}
        columns={columns}
        data={rows}
        emptyMessage={emptyMessage}
        extraClass={styles.list}
        maxHeight={ROW_MAX_HEIGHT}
        onRowClick={onAlertClick}
        onTabChange={(id) => setTab(id as AlertTabType)}
        tabs={showTabs ? tabs : undefined}
      />
    </div>
  )
}
