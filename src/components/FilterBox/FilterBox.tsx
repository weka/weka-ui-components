import React, { useMemo } from 'react'
import { Close } from '../../svgs'
import { FILTERBOXES } from '../../consts'
import {
  DateFilterValue,
  isDateFilterValue
} from '../Table/filters/DateFilter/DateFilter'
import utils from '../../utils'

import './filterBox.scss'

const filterFormatters = {
  dateFilter: ({ startTime, endTime }: DateFilterValue) => {
    if (!startTime && !endTime) {
      return false
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
}

function FilterBox({ name, value: value, onDelete }: FilterBoxProps) {
  const text = useMemo(() => {
    if (typeof value === 'string') {
      return value
    }

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    if (isDateFilterValue(value)) {
      return filterFormatters.dateFilter(value)
    }

    throw new Error('Unknown filter value!')
  }, [value])
  return (
    <div className='box-filter-container' key={name}>
      <span className='filter-headline'>
        {name.toLowerCase() === 'severity'
          ? 'Min Severity'
          : FILTERBOXES[`${name.toUpperCase().replace(/\s/g, '')}`]}
        <Close onClick={onDelete} />
      </span>
      <span className='filter-data'>{text}</span>
    </div>
  )
}

export default FilterBox
