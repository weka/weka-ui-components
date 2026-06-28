import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'

import { NOT_APPLICABLE } from '#v2/utils/consts'
import { formatTimestamp, toDateTime } from '#v2/utils/timeUtils'

const ISO_STRING = '2024-03-15T14:30:00.000Z'
const EPOCH_MS = new Date(ISO_STRING).getTime()
const JS_DATE = new Date(ISO_STRING)
const LUXON_DT = DateTime.fromISO(ISO_STRING)

describe('formatTimestamp - null/undefined/invalid inputs', () => {
  it('returns N/A for null', () => {
    expect(formatTimestamp(null)).toBe(NOT_APPLICABLE)
  })

  it('returns N/A for undefined', () => {
    expect(formatTimestamp(undefined)).toBe(NOT_APPLICABLE)
  })

  it('returns N/A for an invalid date string', () => {
    expect(formatTimestamp('not-a-date')).toBe(NOT_APPLICABLE)
  })
})

describe('formatTimestamp - valid inputs produce consistent output', () => {
  it('ISO string and epoch ms produce the same result', () => {
    expect(formatTimestamp(ISO_STRING)).toBe(formatTimestamp(EPOCH_MS))
  })

  it('ISO string and JS Date produce the same result', () => {
    expect(formatTimestamp(ISO_STRING)).toBe(formatTimestamp(JS_DATE))
  })

  it('ISO string and Luxon DateTime produce the same result', () => {
    expect(formatTimestamp(ISO_STRING)).toBe(formatTimestamp(LUXON_DT))
  })

  it('output matches MM/DD/YYYY, hh:mmAM/PM shape (en-US locale structure)', () => {
    const result = formatTimestamp(ISO_STRING)
    expect(result).not.toBe(NOT_APPLICABLE)
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}(AM|PM)/)
  })
})

describe('toDateTime - null/undefined/invalid inputs', () => {
  it('returns null for null', () => {
    expect(toDateTime(null)).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(toDateTime(undefined)).toBeNull()
  })

  it('returns null for an invalid date string', () => {
    expect(toDateTime('not-a-date')).toBeNull()
  })
})

describe('toDateTime - valid inputs return a DateTime', () => {
  it('parses an ISO string into a valid DateTime', () => {
    const result = toDateTime(ISO_STRING)
    expect(result).not.toBeNull()
    expect(DateTime.isDateTime(result)).toBe(true)
    expect(result!.isValid).toBe(true)
  })

  it('parses an epoch ms number into a valid DateTime', () => {
    const result = toDateTime(EPOCH_MS)
    expect(result).not.toBeNull()
    expect(result!.isValid).toBe(true)
  })

  it('accepts a JS Date', () => {
    const result = toDateTime(JS_DATE)
    expect(result).not.toBeNull()
    expect(result!.isValid).toBe(true)
  })

  it('accepts a Luxon DateTime', () => {
    const result = toDateTime(LUXON_DT)
    expect(result).not.toBeNull()
    expect(result!.isValid).toBe(true)
  })
})
