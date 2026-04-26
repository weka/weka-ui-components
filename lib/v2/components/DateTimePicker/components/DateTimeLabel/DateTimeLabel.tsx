import type { DateTime } from 'luxon'

import { EMPTY_STRING, TIME_FORMATS } from '../../../../utils/consts'
import { formatDate } from '../../../../utils/timeUtils'

const DATE_PORTION_END_INDEX = 9
const SHOULD_SHOW_MILI = false

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
