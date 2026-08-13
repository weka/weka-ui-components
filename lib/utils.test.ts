import { DateTime, Settings } from 'luxon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import utils from '#utils'

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

const MINUTES_IN_HOUR = 60
const RECENT_EVENT_MINUTES = 55
const SWEEP_END_HOURS = 26
const SWEEP_END_MINUTES = MINUTES_IN_HOUR * SWEEP_END_HOURS
const SWEEP_STEP_MINUTES = 7
const FUTURE_EVENT_HOURS = 3

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
    expect(
      squash(
        utils.getRelativeTimeFromISODate(minutesAgo(RECENT_EVENT_MINUTES), true)
      )
    ).toBe(`${RECENT_EVENT_MINUTES}min ago`)
  })

  it('never reports an hours component of 24', () => {
    Settings.defaultZone = LOS_ANGELES
    for (
      let minutes = 1;
      minutes <= SWEEP_END_MINUTES;
      minutes += SWEEP_STEP_MINUTES
    ) {
      expect(utils.getRelativeTimeFromISODate(minutesAgo(minutes))).not.toMatch(
        /\b24h\b/
      )
    }
  })

  it('still marks a genuinely future timestamp as future', () => {
    Settings.defaultZone = LOS_ANGELES
    const future = DateTime.fromISO(NOW_UTC)
      .plus({ hours: FUTURE_EVENT_HOURS })
      .toISO() as string
    expect(squash(utils.getRelativeTimeFromISODate(future))).toBe(
      `in ${FUTURE_EVENT_HOURS}h`
    )
  })
})
