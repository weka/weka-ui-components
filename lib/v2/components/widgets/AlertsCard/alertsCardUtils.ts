import {
  EMPTY_STRING,
  type Severity,
  SEVERITY_ORDER_DESC,
  SEVERITY_TYPES
} from '#v2/utils/consts'

export interface AlertItem {
  id: number | string
  severity: string
  title?: string
  content?: string
  timestamp: string
  count?: number
  groupedAlerts?: AlertItem[]
  muted?: boolean
  type?: string
}

export const ALERT_TAB_TYPES = {
  SYSTEM: 'SYSTEM',
  CUSTOM: 'CUSTOM'
} as const

export type AlertTabType =
  (typeof ALERT_TAB_TYPES)[keyof typeof ALERT_TAB_TYPES]

export const ALERT_SORT_FIELDS = {
  SEVERITY: 'severity',
  DATE: 'date'
} as const

export type AlertSortField =
  (typeof ALERT_SORT_FIELDS)[keyof typeof ALERT_SORT_FIELDS]

export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
} as const

export type SortOrder = (typeof SORT_ORDERS)[keyof typeof SORT_ORDERS]

const CUSTOM_ALERT_TYPE = 'custom'
const SINGLE_OCCURRENCE = 1
const INFO_SEVERITY_RANK = SEVERITY_ORDER_DESC.indexOf(SEVERITY_TYPES.INFO)

/**
 * Ranks a severity by its position in SEVERITY_ORDER_DESC, where the most
 * severe (Critical) is index 0 — so a *lower* rank means *more* severe. Unknown
 * severities fall back to the Info rank.
 */
export function getSeverityRank(severity?: string): number {
  const normalized = severity?.toLowerCase?.() || SEVERITY_TYPES.INFO
  const rank = SEVERITY_ORDER_DESC.indexOf(
    normalized as (typeof SEVERITY_ORDER_DESC)[number]
  )
  return rank === -1 ? INFO_SEVERITY_RANK : rank
}

/**
 * Returns the highest (most severe) severity among the given alerts as a
 * canonical `Severity`; empty input yields the `default` severity. Unknown or
 * missing severities are treated as Info (matching {@link getSeverityRank}), so
 * the result is independent of the alerts' order. Use this to drive the color of
 * a summary badge (e.g. DashboardCard's `severity` prop) so it reflects the
 * worst active alert instead of a fixed color.
 */
export function getHighestSeverity(alerts: AlertItem[]): Severity {
  if (alerts.length === 0) {
    return SEVERITY_TYPES.DEFAULT
  }
  const highestRank = alerts.reduce(
    (rank, alert) => Math.min(rank, getSeverityRank(alert.severity)),
    INFO_SEVERITY_RANK
  )
  return SEVERITY_ORDER_DESC[highestRank]
}

function filterAlerts(
  alerts: AlertItem[],
  tab: AlertTabType,
  showMuted: boolean
): AlertItem[] {
  return alerts
    .filter((alert) => alert.severity?.toLowerCase() !== SEVERITY_TYPES.DEBUG)
    .filter(
      (alert) =>
        tab === ALERT_TAB_TYPES.SYSTEM || alert.type === CUSTOM_ALERT_TYPE
    )
    .filter((alert) => showMuted || !alert.muted)
}

function aggregateAlerts(alerts: AlertItem[]): AlertItem[] {
  const groups = new Map<string, AlertItem & { groupedAlerts: AlertItem[] }>()
  alerts.forEach((alert) => {
    const key = alert.type || String(alert.id)
    const existing = groups.get(key)
    if (existing) {
      existing.count = (existing.count ?? SINGLE_OCCURRENCE) + 1
      existing.groupedAlerts.push(alert)
      if (
        getSeverityRank(alert.severity) < getSeverityRank(existing.severity)
      ) {
        existing.severity = alert.severity
      }
      if (
        new Date(alert.timestamp).getTime() >
        new Date(existing.timestamp).getTime()
      ) {
        existing.timestamp = alert.timestamp
      }
      return
    }
    groups.set(key, {
      ...alert,
      count: SINGLE_OCCURRENCE,
      groupedAlerts: [alert]
    })
  })
  return Array.from(groups.values()).map((alert) => ({
    ...alert,
    count:
      alert.count && alert.count > SINGLE_OCCURRENCE ? alert.count : undefined
  }))
}

function sortAlerts(
  alerts: AlertItem[],
  sortField: AlertSortField,
  sortOrder: SortOrder
): AlertItem[] {
  const sorted = [...alerts]
  if (sortField === ALERT_SORT_FIELDS.SEVERITY) {
    sorted.sort((a, b) => {
      const comparison =
        getSeverityRank(a.severity) - getSeverityRank(b.severity)
      return sortOrder === SORT_ORDERS.ASC ? -comparison : comparison
    })
    return sorted
  }
  sorted.sort((a, b) => {
    const diff =
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    return sortOrder === SORT_ORDERS.ASC ? diff : -diff
  })
  return sorted
}

interface BuildAlertRowsInput {
  alerts: AlertItem[]
  tab: AlertTabType
  showMuted: boolean
  sortField: AlertSortField
  sortOrder: SortOrder
}

/**
 * Filters out debug + (per tab) non-custom + (unless showMuted) muted alerts,
 * groups duplicates by type into a single row with an occurrence `count`, then
 * sorts by severity or timestamp. A grouped row takes its worst member's
 * severity and its latest member's timestamp, so sorting and display reflect
 * the most severe / most recent alert in the group rather than the first seen.
 */
export function buildAlertRows({
  alerts,
  tab,
  showMuted,
  sortField,
  sortOrder
}: BuildAlertRowsInput): AlertItem[] {
  const filtered = filterAlerts(alerts, tab, showMuted)
  const aggregated = aggregateAlerts(filtered)
  return sortAlerts(aggregated, sortField, sortOrder)
}

const MS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_TWO_DAYS = 48
const MS_PER_HOUR = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR
const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE

/**
 * Default timestamp renderer: "N min(s) ago" / "N Hour(s) ago" within two days,
 * otherwise an absolute locale date-time. Apps can inject their own formatter
 * via the `formatTimestamp` prop for exact parity with their existing widgets.
 */
export function formatRelativeTime(timestamp: string): string {
  const time = new Date(timestamp).getTime()
  if (Number.isNaN(time)) {
    return EMPTY_STRING
  }
  const diffMs = Date.now() - time
  if (diffMs < 0) {
    return EMPTY_STRING
  }
  const diffHours = diffMs / MS_PER_HOUR
  if (diffHours < 1) {
    const minutes = Math.max(1, Math.round(diffMs / MS_PER_MINUTE))
    return `${minutes} min${minutes === 1 ? EMPTY_STRING : 's'} ago`
  }
  if (diffHours < HOURS_PER_TWO_DAYS) {
    const hours = Math.round(diffHours)
    return `${hours} Hour${hours === 1 ? EMPTY_STRING : 's'} ago`
  }
  return new Date(time).toLocaleString()
}
