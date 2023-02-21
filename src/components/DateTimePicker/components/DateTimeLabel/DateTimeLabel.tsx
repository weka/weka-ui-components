import React from 'react'
import { DateTime } from 'luxon'
import Utils from '../../../../utils'
import { EMPTY_STRING } from '../../../../consts'
import classNames from 'classnames'

import './DateTimeLabel.scss'

interface DateTimeLabelProps {
  date?: DateTime | null
  showSeconds?: boolean
  showTime?: boolean
  disabled?: boolean
}

function DateTimeLabel(props: DateTimeLabelProps) {
  const { date = null, showSeconds = true, showTime = true, disabled } = props

  const labelClasses = classNames({
    'datetime-label': true,
    'datetime-label-disabled': disabled
  })

  const getTime = () => {
    if (date) {
      return showTime ? `${Utils.formatDate(date, showSeconds, false).slice(0, 9)} • ${Utils.formatDate(date, showSeconds, false).slice(9)}` : `${Utils.formatDate(date, false, false, false)}`
    }
    return EMPTY_STRING
  }

  return (
    <span className={labelClasses}>
      {getTime()}
    </span>
  )
}

export default DateTimeLabel
