import { DateTime, Settings } from 'luxon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import utils from './utils'

// 2026-07-16T01:00Z: UTC has rolled past midnight while America/Los_Angeles
// (UTC-7) is still on 2026-07-15 at 18:00, so the two calendar dates disagree.
const NOW_UTC = '2026-07-16T01:00:00.000Z'
const LOS_ANGELES = 'America/Los_Angeles'
const ZONES = [
  LOS_ANGELES,
  'America/New_York',
  'Asia/Jerusalem',
  'Pacific/Kiritimati',
  'utc'
]

const minutesAgo = (minutes: number) =>
  DateTime.fromISO(NOW_UTC).minus({ minutes }).toISO() as string

const squash = (value: string) => value.replace(/\s+/g, ' ').trim()

describe('getRelativeTimeFromISODate', () => {
  const originalZone = Settings.defaultZone

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(NOW_UTC))
  })

  afterEach(() => {
    vi.useRealTimers()
    Settings.defaultZone = originalZone
  })

  it.each(ZONES)('reports a 55-minute-old event as past in zone %s', (zone) => {
    Settings.defaultZone = zone
    expect(squash(utils.getRelativeTimeFromISODate(minutesAgo(55), true))).toBe(
      '55min ago'
    )
  })

  it('never reports an hours component of 24', () => {
    Settings.defaultZone = LOS_ANGELES
    for (let minutes = 1; minutes <= 60 * 26; minutes += 7) {
      expect(utils.getRelativeTimeFromISODate(minutesAgo(minutes))).not.toMatch(
        /\b24h\b/
      )
    }
  })

  it('still marks a genuinely future timestamp as future', () => {
    Settings.defaultZone = LOS_ANGELES
    const future = DateTime.fromISO(NOW_UTC).plus({ hours: 3 }).toISO() as string
    expect(squash(utils.getRelativeTimeFromISODate(future))).toBe('in 3h')
  })
})
