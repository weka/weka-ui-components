import { getUserLocale } from '#v2/utils/timeUtils'

/**
 * Utility functions for consistent X-axis formatting across all charts
 */

const SECONDS_IN_MINUTE = 60
const MINUTES_IN_HOUR = 60
const MILLISECS_IN_SECOND = 1000
const HOURS_IN_DAY = 24

const MS_PER_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * MILLISECS_IN_SECOND
const MS_PER_DAY = HOURS_IN_DAY * MS_PER_HOUR

/**
 * Converts a range string to a numeric [startMs, endMs] domain tuple.
 *
 * Supported formats:
 * - "Nd" / "Nh" — predefined relative ranges (e.g. "7d", "1h")
 * - "fromSec:toSec" — custom absolute range as Unix timestamps in seconds
 *
 * Returns null for unrecognised formats; callers should fall back to data-driven domain.
 */
export function getRangeDomain(
  range: string,
  now = Date.now()
): [number, number] | null {
  if (range.includes(':')) {
    const colonIdx = range.indexOf(':')
    const from = Number(range.slice(0, colonIdx))
    const to = Number(range.slice(colonIdx + 1))
    if (!Number.isNaN(from) && !Number.isNaN(to) && from > 0 && to > 0) {
      return [from * MILLISECS_IN_SECOND, to * MILLISECS_IN_SECOND]
    }
    return null
  }

  const match = /^(\d+)([dh])$/.exec(range)
  if (!match) {
    return null
  }

  const amount = parseInt(match[1], 10)
  const unit = match[2]
  const durationMs = unit === 'd' ? amount * MS_PER_DAY : amount * MS_PER_HOUR

  return [now - durationMs, now]
}

/**
 * Determines if a range should display dates (in addition to times)
 */
export function isLongRange(range: string): boolean {
  return range === '7d' || range === '30d' || String(range).includes(':')
}

/**
 * Formats a timestamp for X-axis display
 * - For long ranges (7d, 30d, or custom ranges): displays date and time on two lines
 * - For short ranges (1h, 6h, 1d): displays only time
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @param range - Time range string (e.g., '1d', '7d', '2025-12-09T23:30:00+02:00:2025-12-10T07:15:00+02:00')
 * @returns Formatted string with optional newline separator for two-line display
 */
export function formatXAxisTimestamp(timestamp: number, range: string): string {
  const date = new Date(timestamp)
  const locale = getUserLocale()

  if (isLongRange(range)) {
    const dateStr = date.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short'
    })
    const timeStr = date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    return `${dateStr}\n${timeStr}`
  }

  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

/** Bottom margin for charts with two-line dates */
const LONG_RANGE_BOTTOM_MARGIN = 20

/** Standard margin value for chart spacing */
const DEFAULT_MARGIN = 5

/**
 * Standard margin configuration for charts
 */
export const DEFAULT_CHART_MARGIN = {
  top: DEFAULT_MARGIN,
  right: DEFAULT_MARGIN,
  left: DEFAULT_MARGIN,
  bottom: DEFAULT_MARGIN
} as const

/**
 * Gets the bottom margin value for a given range
 * Used for drag overlay height calculations
 */
export function getBottomMargin(range: string): number {
  return isLongRange(range) ? LONG_RANGE_BOTTOM_MARGIN : DEFAULT_MARGIN
}

/**
 * Margin configuration for charts with two-line dates
 */
export function getChartMargin(
  range: string,
  baseMargin: {
    top: number
    right: number
    left: number
    bottom: number
  } = DEFAULT_CHART_MARGIN
) {
  return isLongRange(range)
    ? { ...baseMargin, bottom: LONG_RANGE_BOTTOM_MARGIN }
    : baseMargin
}
