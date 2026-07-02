import type { DateTime } from 'luxon'

/**
 * Clamps a DateTime value to be within the specified min/max bounds.
 */
export function clampDateTime(
  dateTime: DateTime,
  minDate?: DateTime | null,
  maxDate?: DateTime | null
): DateTime {
  if (minDate && dateTime < minDate) {
    return minDate
  }
  if (maxDate && dateTime > maxDate) {
    return maxDate
  }
  return dateTime
}

/**
 * Determines if a day falls outside the allowed min/max bounds.
 */
export function isDayOutOfBounds(
  date: DateTime,
  minDate?: DateTime | null,
  maxDate?: DateTime | null
): boolean {
  return (
    (maxDate ? date > maxDate : false) || (minDate ? date < minDate : false)
  )
}

/**
 * Determines if a day belongs to a month other than the one being displayed.
 */
export function isDayOutsideMonth(date: DateTime, currentMonth: number): boolean {
  return currentMonth !== date.month
}

/**
 * Determines if a day cell should be non-selectable based on month and date bounds.
 */
export function isDayDisabled(
  date: DateTime,
  currentMonth: number,
  minDate?: DateTime | null,
  maxDate?: DateTime | null
): boolean {
  return (
    isDayOutsideMonth(date, currentMonth) ||
    isDayOutOfBounds(date, minDate, maxDate)
  )
}
