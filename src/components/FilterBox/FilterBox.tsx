import React, { useMemo } from 'react'
import { DateTime } from 'luxon'
import { Close } from '../../svgs'
import { FILTERBOXES, TIME_FORMATS } from '../../consts'
import {
  DateFilterValue,
  isDateFilterValue
} from '../Table/filters/DateFilter/DateFilter'
import utils from '../../utils'

import './filterBox.scss'

const filterFormatters = {
  dateFilter: ({ startTime, endTime }: DateFilterValue, hasCustomDateFormat: boolean, customDateFormat: string) => {
    if (!startTime && !endTime) {
      return false
    }
    if (hasCustomDateFormat) {
      return `${
        startTime
          ? DateTime.fromISO(startTime).toFormat(customDateFormat)
          : 'Anytime'
      } → ${
        endTime
          ? DateTime.fromISO(endTime).toFormat(customDateFormat)
          : 'Anytime'
      }`
    }
    return `${
      startTime ? utils.formatISODate(startTime, false) : 'Anytime'
    } → ${endTime ? utils.formatISODate(endTime, false) : 'Anytime'}`
  }
} as const

interface FilterBoxProps {
  name: string
  value: string | Array<string> | Record<string, unknown>
  onDelete: () => void
  hasCustomDateFormat?: boolean
  customDateFormat?: string
}

function FilterBox({ name, value: value, onDelete, hasCustomDateFormat = false, customDateFormat = TIME_FORMATS.DATE_TIME_SECONDS }: FilterBoxProps) {
  const text = useMemo(() => {
    if (typeof value === 'string') {
      return value
    }

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    if (isDateFilterValue(value)) {
      return filterFormatters.dateFilter(value, hasCustomDateFormat, customDateFormat)
    }

    throw new Error('Unknown filter value!')
  }, [value])

  const formattedName = useMemo(() => {
    if (name.toUpperCase().replace(/\s/g, '') in FILTERBOXES) {
      return FILTERBOXES[`${name.toUpperCase().replace(/\s/g, '')}`]
    }
    return name.split('_').join(' ')
  }, [])

  return (
    <div className='box-filter-container' key={name}>
      <span className='filter-headline'>
        {formattedName}
        <Close onClick={onDelete} />
      </span>
      <span className='filter-data'>{text}</span>
    </div>
  )
}

export default FilterBox
