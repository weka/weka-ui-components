import { DateTime } from 'luxon'

import { EMPTY_STRING, NOT_APPLICABLE } from '#v2/utils/consts'

const DAYS_IN_WEEK = 7
const INVALID_MESSAGE = 'Invalid DateTime'
const NOT_DATETIME_MESSAGE = 'Not Valid DateTime Object'
const DEFAULT_LOCALE = 'en-US'

/**
 * Input types accepted by formatTimestamp and toDateTime.
 */
export type TimestampInput =
  | string
  | Date
  | DateTime
  | number
  | null
  | undefined

/**
 * Returns the browser's preferred locale, falling back to en-US in non-browser environments.
 */
export function getUserLocale(): string {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LOCALE
  }
  return navigator.language || navigator.languages?.[0] || DEFAULT_LOCALE
}

/**
 * Unified timestamp formatter: MM/DD/YYYY, hh:mmAM/PM (locale-aware).
 * Returns N/A for null, undefined, or invalid inputs.
 *
 * @param input - Date string, Date object, DateTime object, or Unix timestamp (ms)
 */
export function formatTimestamp(input: TimestampInput): string {
  if (input === null || input === undefined) {
    return NOT_APPLICABLE
  }

  try {
    let date: Date

    if (input instanceof Date) {
      date = input
    } else if (DateTime.isDateTime(input)) {
      date = input.toJSDate()
    } else if (typeof input === 'number') {
      date = new Date(input)
    } else if (typeof input === 'string') {
      date = new Date(input)
    } else {
      return NOT_APPLICABLE
    }

    if (isNaN(date.getTime())) {
      return NOT_APPLICABLE
    }

    const locale = getUserLocale()

    const dateStr = date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    const timeStr = date
      .toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      .replace(' ', EMPTY_STRING)

    return `${dateStr}, ${timeStr}`
  } catch {
    return NOT_APPLICABLE
  }
}

/**
 * Converts a TimestampInput to a Luxon DateTime, or null for null/undefined/invalid inputs.
 * Uses new Date(string) to match formatTimestamp's string parsing behaviour.
 */
export function toDateTime(input: TimestampInput): DateTime | null {
  if (input === null || input === undefined) {
    return null
  }

  try {
    let date: Date

    if (input instanceof Date) {
      date = input
    } else if (DateTime.isDateTime(input)) {
      date = input.toJSDate()
    } else if (typeof input === 'number') {
      date = new Date(input)
    } else if (typeof input === 'string') {
      date = new Date(input)
    } else {
      return null
    }

    if (isNaN(date.getTime())) {
      return null
    }

    const dateTime = DateTime.fromJSDate(date)
    return dateTime.isValid ? dateTime : null
  } catch {
    return null
  }
}

/**
 * Formats an ISO date string for display, optionally including time components.
 */
export function formatISODate(
  isoDate: string,
  showMili = true,
  showSeconds = true,
  showTime = true
): string {
  const datePart = DateTime.fromISO(isoDate).toLocaleString({
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  })

  if (!showTime) {
    return `${datePart} ${EMPTY_STRING}`
  }

  const timePart = DateTime.fromISO(isoDate).toLocaleString({
    hour: '2-digit',
    minute: '2-digit',
    ...(showSeconds && { second: '2-digit' }),
    ...(showMili && showSeconds && { fractionalSecondDigits: 3 }),
    hourCycle: 'h23'
  })

  return `${datePart} ${timePart}`
}

/**
 * Formats a Luxon DateTime for display.
 */
export function formatDate(
  dateIn: DateTime,
  showSeconds = true,
  showMili = true,
  showTime = true
): string {
  if (!DateTime.isDateTime(dateIn)) {
    return NOT_DATETIME_MESSAGE
  }
  const isoString = dateIn.toISO()
  if (isoString === null) {
    return INVALID_MESSAGE
  }
  return formatISODate(isoString, showMili, showSeconds, showTime)
}

/**
 * Returns days of the month containing the reference date, organized by week.
 * Includes leading and trailing days from adjacent months to fill weeks.
 */
export function getDaysOfTheMonth(referenceDate: DateTime): DateTime[][] {
  const startDate = DateTime.local(referenceDate.year, referenceDate.month)
  let fromDate = startDate.minus({ day: startDate.weekday - 1 })
  const endDate = DateTime.local(referenceDate.year, referenceDate.month).plus({
    month: 1
  })
  const toDate = endDate.plus({ day: DAYS_IN_WEEK - endDate.weekday })
  const monthDaysByWeek: DateTime[][] = []
  let daysOfWeek: DateTime[] = []
  while (fromDate <= toDate) {
    const appendDate = fromDate.set({
      hour: referenceDate.hour,
      minute: referenceDate.minute,
      second: referenceDate.second
    })
    daysOfWeek.push(appendDate)
    if (fromDate.weekday === DAYS_IN_WEEK) {
      monthDaysByWeek.push(daysOfWeek)
      daysOfWeek = []
    }
    fromDate = fromDate.plus({ day: 1 })
  }
  return monthDaysByWeek
}
