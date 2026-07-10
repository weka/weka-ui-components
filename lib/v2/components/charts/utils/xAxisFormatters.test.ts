import { describe, expect, it } from 'vitest'

import {
  DEFAULT_CHART_MARGIN,
  formatTooltipTimestamp,
  formatXAxisTimestamp,
  getBottomMargin,
  getChartMargin,
  getRangeDomain,
  isLongRange
} from './xAxisFormatters'

const CUSTOM_ISO_RANGE = '2025-12-09T23:30:00+02:00:2025-12-10T07:15:00+02:00'
const SAMPLE_DATE_ISO = '2024-03-15T14:30:00Z'

const LONG_RANGE_BOTTOM_MARGIN = 20
const DEFAULT_BOTTOM_MARGIN = 5

describe('xAxisFormatters', () => {
  describe('isLongRange', () => {
    it('returns true for 7d range', () => {
      expect(isLongRange('7d')).toBe(true)
    })

    it('returns true for 30d range', () => {
      expect(isLongRange('30d')).toBe(true)
    })

    it('returns true for custom range with colon', () => {
      expect(isLongRange(CUSTOM_ISO_RANGE)).toBe(true)
    })

    it('returns false for 1h range', () => {
      expect(isLongRange('1h')).toBe(false)
    })

    it('returns false for 6h range', () => {
      expect(isLongRange('6h')).toBe(false)
    })

    it('returns false for 1d range', () => {
      expect(isLongRange('1d')).toBe(false)
    })

    it('returns false for 24h range', () => {
      expect(isLongRange('24h')).toBe(false)
    })
  })

  describe('getRangeDomain', () => {
    const NOW = new Date(SAMPLE_DATE_ISO).getTime()
    const MS_PER_HOUR = 3_600_000
    const HOURS_PER_DAY = 24
    const MS_PER_DAY = HOURS_PER_DAY * MS_PER_HOUR
    const SIX_HOURS = 6
    const SEVEN_DAYS = 7
    const FROM_SEC_AS_MS = 100_000
    const TO_SEC_AS_MS = 200_000

    it('converts an hour range to [now - Nh, now]', () => {
      expect(getRangeDomain('6h', NOW)).toEqual([
        NOW - SIX_HOURS * MS_PER_HOUR,
        NOW
      ])
    })

    it('converts a day range to [now - Nd, now]', () => {
      expect(getRangeDomain('7d', NOW)).toEqual([
        NOW - SEVEN_DAYS * MS_PER_DAY,
        NOW
      ])
    })

    it('converts a fromSec:toSec range to millisecond bounds', () => {
      expect(getRangeDomain('100:200', NOW)).toEqual([
        FROM_SEC_AS_MS,
        TO_SEC_AS_MS
      ])
    })

    it('returns null for a colon range with non-numeric parts', () => {
      expect(getRangeDomain(CUSTOM_ISO_RANGE, NOW)).toBeNull()
    })

    it('returns null for unrecognised formats', () => {
      expect(getRangeDomain('yesterday', NOW)).toBeNull()
    })
  })

  describe('formatXAxisTimestamp', () => {
    const timestamp = new Date(SAMPLE_DATE_ISO).getTime()

    it('returns time only for short range (1d)', () => {
      const result = formatXAxisTimestamp(timestamp, '1d')

      expect(result).toMatch(/^\d{2}:\d{2}$/)
    })

    it('returns time only for short range (1h)', () => {
      const result = formatXAxisTimestamp(timestamp, '1h')

      expect(result).toMatch(/^\d{2}:\d{2}$/)
    })

    it('returns date and time for long range (7d)', () => {
      const result = formatXAxisTimestamp(timestamp, '7d')

      expect(result).toContain('\n')
      expect(result).toMatch(/(\d{2}\s\w{3}|\w{3}\s\d{2})/)
      expect(result).toMatch(/\d{2}:\d{2}/)
    })

    it('returns date and time for long range (30d)', () => {
      const result = formatXAxisTimestamp(timestamp, '30d')

      expect(result).toContain('\n')
    })

    it('returns date and time for custom range with colon', () => {
      const result = formatXAxisTimestamp(timestamp, CUSTOM_ISO_RANGE)

      expect(result).toContain('\n')
    })
  })

  describe('formatTooltipTimestamp', () => {
    const timestamp = new Date(SAMPLE_DATE_ISO).getTime()

    it('formats a millisecond timestamp as date and 24-hour time', () => {
      const result = formatTooltipTimestamp(timestamp)

      expect(result).toMatch(/(\d{2}\s\w{3}|\w{3}\s\d{2})/)
      expect(result).toContain('2024')
      expect(result).toMatch(/\d{2}:\d{2}$/)
      expect(result).not.toMatch(/am|pm/i)
    })

    it('accepts a numeric string timestamp', () => {
      expect(formatTooltipTimestamp(String(timestamp))).toBe(
        formatTooltipTimestamp(timestamp)
      )
    })

    it('returns the input unchanged when it cannot be parsed', () => {
      expect(formatTooltipTimestamp('not-a-date')).toBe('not-a-date')
    })
  })

  describe('DEFAULT_CHART_MARGIN', () => {
    it('has correct default values', () => {
      expect(DEFAULT_CHART_MARGIN).toEqual({
        top: 5,
        right: 5,
        left: 5,
        bottom: 5
      })
    })
  })

  describe('getBottomMargin', () => {
    it('returns 20 for long range (7d)', () => {
      expect(getBottomMargin('7d')).toBe(LONG_RANGE_BOTTOM_MARGIN)
    })

    it('returns 20 for long range (30d)', () => {
      expect(getBottomMargin('30d')).toBe(LONG_RANGE_BOTTOM_MARGIN)
    })

    it('returns 20 for custom range with colon', () => {
      expect(getBottomMargin(CUSTOM_ISO_RANGE)).toBe(LONG_RANGE_BOTTOM_MARGIN)
    })

    it('returns 5 for short range (1d)', () => {
      expect(getBottomMargin('1d')).toBe(DEFAULT_BOTTOM_MARGIN)
    })

    it('returns 5 for short range (1h)', () => {
      expect(getBottomMargin('1h')).toBe(DEFAULT_BOTTOM_MARGIN)
    })

    it('returns 5 for short range (6h)', () => {
      expect(getBottomMargin('6h')).toBe(DEFAULT_BOTTOM_MARGIN)
    })
  })

  describe('getChartMargin', () => {
    it('returns margin with bottom 20 for long range', () => {
      const result = getChartMargin('7d')

      expect(result).toEqual({
        top: 5,
        right: 5,
        left: 5,
        bottom: 20
      })
    })

    it('returns default margin for short range', () => {
      const result = getChartMargin('1d')

      expect(result).toEqual(DEFAULT_CHART_MARGIN)
    })

    it('uses custom base margin when provided', () => {
      const customMargin = { top: 10, right: 10, left: 10, bottom: 10 }

      const result = getChartMargin('1d', customMargin)

      expect(result).toEqual(customMargin)
    })

    it('overrides bottom margin of custom base for long range', () => {
      const customMargin = { top: 10, right: 10, left: 10, bottom: 10 }

      const result = getChartMargin('7d', customMargin)

      expect(result).toEqual({
        top: 10,
        right: 10,
        left: 10,
        bottom: 20
      })
    })
  })
})
