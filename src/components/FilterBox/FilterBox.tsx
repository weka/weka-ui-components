import { useMemo } from 'react'
import { Close } from '../../svgs'
import { FILTERBOXES } from '../../consts'

import './filterBox.scss'
import { DateFilterValue } from '../Table/filters/DateFilter/DateFilter'
import utils from '../../utils'

const filterFormatters = {
  dateFilter: ({ start_time, end_time }: DateFilterValue) => {
    if (!start_time && !end_time) {
      return false
    }
    return `${
      start_time ? utils.formatISODate(start_time, false) : 'Anytime'
    } → ${end_time ? utils.formatISODate(end_time, false) : 'Anytime'}`
  }
} as const

const isDateFilterValue = (obj: unknown): obj is DateFilterValue =>
  !!(utils.isObject(obj) && ('start_time' in obj || 'end_time' in obj))

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
