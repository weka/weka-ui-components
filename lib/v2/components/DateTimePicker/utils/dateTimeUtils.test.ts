import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'

import { clampDateTime, isDayDisabled } from './dateTimeUtils'

const MARCH_START = '2024-03-01T00:00:00'
const MARCH_END = '2024-03-31T23:59:59'
const MID_MARCH = '2024-03-15'

describe('clampDateTime', () => {
  const baseDate = DateTime.fromISO('2024-03-15T12:00:00')

  it('returns the same date when no bounds provided', () => {
    expect(clampDateTime(baseDate).equals(baseDate)).toBe(true)
  })

  it('returns the same date when within bounds', () => {
    const minDate = DateTime.fromISO(MARCH_START)
    const maxDate = DateTime.fromISO(MARCH_END)
    expect(clampDateTime(baseDate, minDate, maxDate).equals(baseDate)).toBe(
      true
    )
  })

  it('returns minDate when date is before minDate', () => {
    const minDate = DateTime.fromISO('2024-03-20T00:00:00')
    expect(clampDateTime(baseDate, minDate).equals(minDate)).toBe(true)
  })

  it('returns maxDate when date is after maxDate', () => {
    const maxDate = DateTime.fromISO('2024-03-10T00:00:00')
    expect(clampDateTime(baseDate, null, maxDate).equals(maxDate)).toBe(true)
  })

  it('handles null minDate', () => {
    const maxDate = DateTime.fromISO(MARCH_END)
    expect(clampDateTime(baseDate, null, maxDate).equals(baseDate)).toBe(true)
  })

  it('handles null maxDate', () => {
    const minDate = DateTime.fromISO(MARCH_START)
    expect(clampDateTime(baseDate, minDate, null).equals(baseDate)).toBe(true)
  })

  it('handles both null bounds', () => {
    expect(clampDateTime(baseDate, null, null).equals(baseDate)).toBe(true)
  })

  it('prioritizes minDate when date is before both bounds', () => {
    const earlyDate = DateTime.fromISO('2024-01-01T00:00:00')
    const minDate = DateTime.fromISO(MARCH_START)
    const maxDate = DateTime.fromISO(MARCH_END)
    expect(clampDateTime(earlyDate, minDate, maxDate).equals(minDate)).toBe(
      true
    )
  })

  it('clamps time component as well', () => {
    const timeDate = DateTime.fromISO('2024-03-15T08:00:00')
    const minDate = DateTime.fromISO('2024-03-15T10:00:00')
    const result = clampDateTime(timeDate, minDate)
    const expectedHour = 10
    expect(result.equals(minDate)).toBe(true)
    expect(result.hour).toBe(expectedHour)
  })
})

describe('isDayDisabled', () => {
  const marchDate = DateTime.fromISO(MID_MARCH)
  const aprilDate = DateTime.fromISO('2024-04-15')
  const marchMonth = 3

  it('returns false for date in current month within bounds', () => {
    expect(isDayDisabled(marchDate, marchMonth)).toBe(false)
  })

  it('returns true for date not in current month', () => {
    expect(isDayDisabled(aprilDate, marchMonth)).toBe(true)
  })

  it('returns true when date is after maxDate', () => {
    const maxDate = DateTime.fromISO('2024-03-10')
    expect(isDayDisabled(marchDate, marchMonth, null, maxDate)).toBe(true)
  })

  it('returns true when date is before minDate', () => {
    const minDate = DateTime.fromISO('2024-03-20')
    expect(isDayDisabled(marchDate, marchMonth, minDate)).toBe(true)
  })

  it('returns false when date equals minDate', () => {
    const minDate = DateTime.fromISO(MID_MARCH)
    expect(isDayDisabled(marchDate, marchMonth, minDate)).toBe(false)
  })

  it('returns false when date equals maxDate', () => {
    const maxDate = DateTime.fromISO(MID_MARCH)
    expect(isDayDisabled(marchDate, marchMonth, null, maxDate)).toBe(false)
  })

  it('handles null bounds', () => {
    expect(isDayDisabled(marchDate, marchMonth, null, null)).toBe(false)
  })

  it('prioritizes month mismatch over date bounds', () => {
    const minDate = DateTime.fromISO('2024-03-01')
    const maxDate = DateTime.fromISO('2024-04-30')
    expect(isDayDisabled(aprilDate, marchMonth, minDate, maxDate)).toBe(true)
  })
})
