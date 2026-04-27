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
 * Determines if a day cell should be disabled based on month and date bounds.
 */
export function isDayDisabled(
  date: DateTime,
  currentMonth: number,
  minDate?: DateTime | null,
  maxDate?: DateTime | null
): boolean {
  return (
    currentMonth !== date.month ||
    (maxDate ? date > maxDate : false) ||
    (minDate ? date < minDate : false)
  )
}
