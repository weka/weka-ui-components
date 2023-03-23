import React, { useState } from 'react'
import { DateTime } from 'luxon'
import DateTimePicker from '../../../DateTimePicker'

import './dateFilter.scss'
import FilterWrapper from '../FilterWrapper'
import { UseFiltersColumnProps } from 'react-table'
import { EMPTY_STRING } from '../../../../consts'

interface ExtendedFiltersColumn<T extends object>
  extends UseFiltersColumnProps<T> {
  Header: string
  id?: string
}

interface DateFilterProps {
  column: ExtendedFiltersColumn<object>
}

export interface DateFilterValue {
  start_time?: string
  end_time?: string
}

function DateFilter({ column }: DateFilterProps) {
  const { filterValue, setFilter, id = EMPTY_STRING, Header } = column

  const [from, onFromChange] = useState(
    filterValue?.startTime ? DateTime.fromISO(filterValue.startTime) : undefined
  )
  const [to, onToChange] = useState(
    filterValue?.endTime ? DateTime.fromISO(filterValue.endTime) : undefined
  )

  const value = {
    start_time: from?.toJSDate().toISOString() || undefined,
    end_time: to?.toJSDate().toISOString() || undefined
  }

  return (
    <FilterWrapper
      setFilter={setFilter}
      value={value}
      columnTitle={id || Header}
    >
      <div className='date-filter-wrapper'>
        <div>
          <DateTimePicker
            onChange={onFromChange}
            value={from}
            label='FROM'
            maxDate={to ? to.endOf('day') : DateTime.now()}
            showSeconds
          />
        </div>
        <div>
          <DateTimePicker
            onChange={onToChange}
            value={to}
            label='TO'
            minDate={from && from.startOf('day')}
            showSeconds
          />
        </div>

      </div>
    </FilterWrapper>
  )
}

export default DateFilter
