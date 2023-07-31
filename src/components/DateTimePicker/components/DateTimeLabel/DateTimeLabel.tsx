import React from 'react'
import { DateTime } from 'luxon'
import Utils from '../../../../utils'
import clsx from 'clsx'
import { EMPTY_STRING, TIME_FORMATS } from '../../../../consts'

import './DateTimeLabel.scss'

interface DateTimeLabelProps {
  date?: DateTime | null
  showSeconds?: boolean
  showTime?: boolean
  disabled?: boolean
  enableCustomFormat?: boolean
  customFormat?: string
}

function DateTimeLabel(props: DateTimeLabelProps) {
  const {
    date = null,
    showSeconds = true,
    showTime = true,
    disabled,
    enableCustomFormat = false,
    customFormat = TIME_FORMATS.DATE
  } = props

  const labelClasses = clsx({
    'datetime-label': true,
    'datetime-label-disabled': disabled
  })

  const getTime = () => {
    if (date) {
      if (showTime) {
        if (enableCustomFormat) {
          return `${date.toFormat(customFormat)} • ${Utils.formatDate(
            date,
            showSeconds,
            false
          ).slice(9)}`
        }
        return `${Utils.formatDate(date, showSeconds, false).slice(
          0,
          9
        )} • ${Utils.formatDate(date, showSeconds, false).slice(9)}`
      }
      return `${Utils.formatDate(date, false, false, false)}`
    }
    return EMPTY_STRING
  }

  return <span className={labelClasses}>{getTime()}</span>
}

export default DateTimeLabel
