export const SCHEDULER_TYPES = {
  PERIODIC: 'periodic',
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
}

export const WEEK_DAYS = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday'
}

export const MONTHS = {
  JANUARY: 'january',
  FEBRUARY: 'february',
  MARCH: 'march',
  APRIL: 'april',
  MAY: 'may',
  JUNE: 'june',
  JULY: 'july',
  AUGUST: 'august',
  SEPTEMBER: 'september',
  OCTOBER: 'october',
  NOVEMBER: 'november',
  DECEMBER: 'december'
}

export const MONTHS_OPTIONS = [
  { label: 'JANUARY', value: MONTHS.JANUARY },
  { label: 'FEBRUARY', value: MONTHS.FEBRUARY },
  { label: 'MARCH', value: MONTHS.MARCH },
  { label: 'APRIL', value: MONTHS.APRIL },
  { label: 'MAY', value: MONTHS.MAY },
  { label: 'JUNE', value: MONTHS.JUNE },
  { label: 'JULY', value: MONTHS.JULY },
  { label: 'AUGUST', value: MONTHS.AUGUST },
  { label: 'SEPTEMBER', value: MONTHS.SEPTEMBER },
  { label: 'OCTOBER', value: MONTHS.OCTOBER },
  { label: 'NOVEMBER', value: MONTHS.NOVEMBER },
  { label: 'DECEMBER', value: MONTHS.DECEMBER }
]

export const DAYS_OPTIONS = [
  { value: WEEK_DAYS.MONDAY, label: 'Monday' },
  { value: WEEK_DAYS.TUESDAY, label: 'Tuesday' },
  { value: WEEK_DAYS.WEDNESDAY, label: 'Wednesday' },
  { value: WEEK_DAYS.THURSDAY, label: 'Thursday' },
  { value: WEEK_DAYS.FRIDAY, label: 'Friday' },
  { value: WEEK_DAYS.SATURDAY, label: 'Saturday' },
  { value: WEEK_DAYS.SUNDAY, label: 'Sunday' }
]

export const WORK_DAYS = `${WEEK_DAYS.MONDAY}, ${WEEK_DAYS.TUESDAY}, ${WEEK_DAYS.WEDNESDAY}, ${WEEK_DAYS.THURSDAY}, ${WEEK_DAYS.FRIDAY}`

export const SELECT_ALL = 'all'

export const EVERY_DAY = {
  label: 'Every Day',
  value: 'EveryDay'
}

export const SPECIFIC_DAYS = {
  label: 'Specific Days',
  value: 'SpecificDays'
}

export const EVERY_HOUR = {
  label: 'Every Hour',
  value: 'EveryHour'
}

export const SPECIFIC_HOURS = {
  label: 'Specific Hours',
  value: 'SpecificHours'
}

export const EVERY_MONTH = {
  label: 'Every Month',
  value: 'EveryMonth'
}

export const SPECIFIC_MONTH = {
  label: 'Specific Month',
  value: 'SpecificMonth'
}

export const MIDNIGHT = '00:00'

export const DAYS_OF_WEEK = [
  { label: 'M', value: WEEK_DAYS.MONDAY },
  { label: 'T', value: WEEK_DAYS.TUESDAY },
  { label: 'W', value: WEEK_DAYS.WEDNESDAY },
  { label: 'T', value: WEEK_DAYS.THURSDAY },
  { label: 'F', value: WEEK_DAYS.FRIDAY },
  { label: 'S', value: WEEK_DAYS.SATURDAY },
  { label: 'S', value: WEEK_DAYS.SUNDAY }
]

export const MINUTES_OFFSETS = {
  MAX: 59,
  DEFAULT: 30
}

export const DEFAULT_HOUR = '09'

export const DEFAULT_INTERVAL = 30
