import type { DateTime } from 'luxon'

import { EMPTY_STRING } from '../../../../utils/consts'
import { formatDate } from '../../../../utils/timeUtils'

const DATE_PORTION_END_INDEX = 9
const SHOULD_SHOW_MILI = false

const TIME_FORMATS = {
  DATE: 'yyyy-MM-dd',
  MONTH_DAY_TIME: 'MMM dd HH:mm',
  MONTH_DAY: 'MMM dd',
  DATE_TIME: 'yyyy-MM-dd HH:mm',
  DATE_TIME_SECONDS: 'yyyy-MM-dd HH:mm:ss',
  DATE_TIME_SECONDS_MS: 'yyyy-MM-dd HH:mm:ss.SSS',
  HOUR_MIN: 'HH:mm',
  MAIN_DATE_TIME_FORMAT: 'MMM dd, yyyy HH:mm'
} as const

export interface DateTimeLabelProps {
  date?: DateTime | null
  showSeconds?: boolean
  showTime?: boolean
  enableCustomFormat?: boolean
  customFormat?: string
  disabled?: boolean
}

export function DateTimeLabel({
  date = null,
  showSeconds = true,
  showTime = true,
  enableCustomFormat = false,
  customFormat = TIME_FORMATS.DATE
}: Readonly<DateTimeLabelProps>) {
  const getTime = () => {
    if (!date) {
      return EMPTY_STRING
    }

    if (!showTime) {
      return formatDate(date, false, false, false)
    }

    const formattedDateTime = formatDate(date, showSeconds, SHOULD_SHOW_MILI)
    const datePortion = enableCustomFormat
      ? date.toFormat(customFormat)
      : formattedDateTime.slice(0, DATE_PORTION_END_INDEX)
    const timePortion = formattedDateTime.slice(DATE_PORTION_END_INDEX)

    return `${datePortion} • ${timePortion}`
  }

  return <span>{getTime()}</span>
}
