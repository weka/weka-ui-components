import { DateTime } from 'luxon'

import { DAYS_IN_WEEK, EMPTY_STRING } from './consts'

const INVALID_MESSAGE = 'Invalid DateTime'
const NOT_DATETIME_MESSAGE = 'Not Valid DateTime Object'

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
