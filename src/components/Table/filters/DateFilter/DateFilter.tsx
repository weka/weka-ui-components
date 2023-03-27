import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import DateTimePicker from '../../../DateTimePicker'
import FilterWrapper from '../FilterWrapper'
import { UseFiltersColumnProps } from 'react-table'
import { EMPTY_STRING } from '../../../../consts'
import utils from '../../../../utils'
import Button from '../../../Button'

import './dateFilter.scss'

interface ExtendedFiltersColumn<T extends object>
  extends UseFiltersColumnProps<T> {
  Header: string
  id?: string
}

interface DateFilterProps {
  column: ExtendedFiltersColumn<object>
}

export interface DateFilterValue {
  startTime?: string
  endTime?: string
}

export const isDateFilterValue = (obj: unknown): obj is DateFilterValue =>
  !!(utils.isObject(obj) && ('startTime' in obj || 'endTime' in obj))

function DateFilter({ column }: DateFilterProps) {
  const { filterValue, setFilter, id = EMPTY_STRING, Header } = column

  const [from, onFromChange] = useState(
    filterValue?.startTime ? DateTime.fromISO(filterValue.startTime) : undefined
  )
  const [to, onToChange] = useState(
    filterValue?.endTime ? DateTime.fromISO(filterValue.endTime) : undefined
  )

  useEffect(() => {
    if (!filterValue)
    onFromChange(undefined)
  }, [filterValue])

  return (
    <FilterWrapper setFilter={setFilter} columnTitle={id || Header} hideWrapper>
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
        <div className='date-filter-controller'>
          <Button
            disable={!from && !to}
            empty
            onClick={() => {
              onFromChange(undefined)
              onToChange(undefined)
            }}
          >
            Clear
          </Button>
          <Button
            disable={!from && !to}
            onClick={() =>
              setFilter({
                startTime: from?.toJSDate().toISOString() || undefined,
                endTime: to?.toJSDate().toISOString() || undefined
              })
            }
          >
            Filter
          </Button>
        </div>
      </div>
    </FilterWrapper>
  )
}

export default DateFilter
