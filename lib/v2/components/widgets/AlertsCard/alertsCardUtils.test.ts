import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import {
  ALERT_SORT_FIELDS,
  ALERT_TAB_TYPES,
  type AlertItem,
  buildAlertRows,
  formatRelativeTime,
  getSeverityRank,
  SORT_ORDERS
} from './alertsCardUtils'

const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 3_600_000
const MINUTES_AGO = 5
const HOURS_AGO = 3

const baseAlert = (overrides: Partial<AlertItem>): AlertItem => ({
  id: 1,
  severity: 'info',
  title: 'An alert',
  timestamp: '2026-06-23T09:00:00Z',
  ...overrides
})

describe('getSeverityRank', () => {
  it('ranks more severe alerts with a lower index (descending order)', () => {
    expect(getSeverityRank('critical')).toBeLessThan(getSeverityRank('info'))
    expect(getSeverityRank('major')).toBeLessThan(getSeverityRank('warning'))
  })

  it('is case-insensitive and falls back to info rank for unknown severities', () => {
    expect(getSeverityRank('CRITICAL')).toBe(getSeverityRank('critical'))
    expect(getSeverityRank('not-a-severity')).toBe(getSeverityRank('info'))
    expect(getSeverityRank()).toBe(getSeverityRank('info'))
  })
})

describe('buildAlertRows', () => {
  const defaults = {
    tab: ALERT_TAB_TYPES.SYSTEM,
    showMuted: false,
    sortField: ALERT_SORT_FIELDS.DATE,
    sortOrder: SORT_ORDERS.DESC
  }

  it('drops debug-severity alerts', () => {
    const rows = buildAlertRows({
      alerts: [
        baseAlert({ id: 1, severity: 'debug', type: 'DEBUG_THING' }),
        baseAlert({ id: 2, severity: 'critical', type: 'REAL_THING' })
      ],
      ...defaults
    })
    expect(rows).toHaveLength(1)
    expect(rows[0].severity).toBe('critical')
  })

  it('hides muted alerts unless showMuted is set', () => {
    const alerts = [
      baseAlert({ id: 1, type: 'A', muted: true }),
      baseAlert({ id: 2, type: 'B' })
    ]
    expect(buildAlertRows({ alerts, ...defaults })).toHaveLength(1)
    expect(
      buildAlertRows({ alerts, ...defaults, showMuted: true })
    ).toHaveLength(alerts.length)
  })

  it('shows only custom-type alerts on the Custom tab', () => {
    const alerts = [
      baseAlert({ id: 1, type: 'SYSTEM_THING' }),
      baseAlert({ id: 2, type: 'custom' })
    ]
    const customRows = buildAlertRows({
      alerts,
      ...defaults,
      tab: ALERT_TAB_TYPES.CUSTOM
    })
    expect(customRows).toHaveLength(1)
    expect(customRows[0].type).toBe('custom')
  })

  it('groups same-type alerts into one row with an occurrence count', () => {
    const sameType = [
      baseAlert({ id: 1, type: 'FS_CAPACITY' }),
      baseAlert({ id: 2, type: 'FS_CAPACITY' }),
      baseAlert({ id: 3, type: 'FS_CAPACITY' })
    ]
    const rows = buildAlertRows({ alerts: sameType, ...defaults })
    expect(rows).toHaveLength(1)
    expect(rows[0].count).toBe(sameType.length)
  })

  it('represents a group by its worst severity and latest timestamp', () => {
    const rows = buildAlertRows({
      alerts: [
        baseAlert({
          id: 1,
          type: 'DRIVE',
          severity: 'minor',
          timestamp: '2026-06-23T08:00:00Z'
        }),
        baseAlert({
          id: 2,
          type: 'DRIVE',
          severity: 'critical',
          timestamp: '2026-06-23T10:00:00Z'
        })
      ],
      ...defaults
    })
    expect(rows).toHaveLength(1)
    expect(rows[0].severity).toBe('critical')
    expect(rows[0].timestamp).toBe('2026-06-23T10:00:00Z')
  })

  it('ranks a grouped row by its worst member under severity sort', () => {
    const rows = buildAlertRows({
      alerts: [
        baseAlert({ id: 1, type: 'DRIVE', severity: 'minor' }),
        baseAlert({ id: 2, type: 'DRIVE', severity: 'critical' }),
        baseAlert({ id: 3, type: 'FS', severity: 'major' })
      ],
      ...defaults,
      sortField: ALERT_SORT_FIELDS.SEVERITY
    })
    expect(rows.map((alert) => alert.type)).toEqual(['DRIVE', 'FS'])
  })

  it('leaves a single alert without a count', () => {
    const rows = buildAlertRows({
      alerts: [baseAlert({ id: 1, type: 'FS_CAPACITY' })],
      ...defaults
    })
    expect(rows[0].count).toBeUndefined()
  })

  it('sorts by severity, most severe first, when requested', () => {
    const rows = buildAlertRows({
      alerts: [
        baseAlert({ id: 1, severity: 'info', type: 'A' }),
        baseAlert({ id: 2, severity: 'critical', type: 'B' }),
        baseAlert({ id: 3, severity: 'warning', type: 'C' })
      ],
      ...defaults,
      sortField: ALERT_SORT_FIELDS.SEVERITY
    })
    expect(rows.map((alert) => alert.severity)).toEqual([
      'critical',
      'warning',
      'info'
    ])
  })

  it('sorts by most recent timestamp first by default', () => {
    const rows = buildAlertRows({
      alerts: [
        baseAlert({ type: 'oldest', timestamp: '2026-06-20T00:00:00Z' }),
        baseAlert({ type: 'newest', timestamp: '2026-06-23T00:00:00Z' }),
        baseAlert({ type: 'middle', timestamp: '2026-06-21T00:00:00Z' })
      ],
      ...defaults
    })
    expect(rows.map((alert) => alert.type)).toEqual([
      'newest',
      'middle',
      'oldest'
    ])
  })
})

describe('formatRelativeTime', () => {
  it('returns minutes-ago for very recent timestamps', () => {
    const recent = new Date(
      Date.now() - MINUTES_AGO * MS_PER_MINUTE
    ).toISOString()
    expect(formatRelativeTime(recent)).toBe(`${MINUTES_AGO} mins ago`)
  })

  it('returns hours-ago within two days', () => {
    const earlier = new Date(Date.now() - HOURS_AGO * MS_PER_HOUR).toISOString()
    expect(formatRelativeTime(earlier)).toBe(`${HOURS_AGO} Hours ago`)
  })

  it('returns an empty string for invalid input', () => {
    expect(formatRelativeTime('not-a-date')).toBe(EMPTY_STRING)
  })
})
