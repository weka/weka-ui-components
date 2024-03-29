import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import DateTimePicker from '../../../DateTimePicker'
import FilterWrapper from '../FilterWrapper'
import { UseFiltersColumnProps } from 'react-table'
import { EMPTY_STRING } from '../../../../consts'
import utils from '../../../../utils'
import Button from '../../../Button'
import useToggle from '../../../../hooks/useToggle'

import './dateFilter.scss'

interface ExtendedFiltersColumn<T extends object>
  extends UseFiltersColumnProps<T> {
  Header: string
  id?: string
  customTitle?: string
  enableCustomFormat?: boolean
  customFormat?: string
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
  const {
    filterValue,
    setFilter,
    id = EMPTY_STRING,
    customTitle = EMPTY_STRING,
    Header,
    enableCustomFormat,
    customFormat
  } = column

  const [from, onFromChange] = useState(
    filterValue?.startTime ? DateTime.fromISO(filterValue.startTime) : undefined
  )
  const [to, onToChange] = useState(
    filterValue?.endTime ? DateTime.fromISO(filterValue.endTime) : undefined
  )

  const [isFilterOpen, toggleIsFilterOpen] = useToggle(false)

  useEffect(() => {
    if (!filterValue) {
      onFromChange(undefined)
      onToChange(undefined)
    }
  }, [filterValue])

  return (
    <FilterWrapper
      setFilter={setFilter}
      columnTitle={customTitle || id || Header}
      hideWrapper
      isPopperOpen={isFilterOpen}
      onTogglePopper={toggleIsFilterOpen}
    >
      <div className='date-filter-wrapper'>
        <div>
          <DateTimePicker
            onChange={onFromChange}
            value={from}
            label='FROM'
            maxDate={to ? to.endOf('day') : DateTime.now()}
            showSeconds
            enableCustomFormat={enableCustomFormat}
            customFormat={customFormat}
          />
        </div>
        <div>
          <DateTimePicker
            onChange={onToChange}
            value={to}
            label='TO'
            minDate={from && from.startOf('day')}
            showSeconds
            enableCustomFormat={enableCustomFormat}
            customFormat={customFormat}
          />
        </div>
        <div className='date-filter-controller'>
          <Button
            disable={!from && !to}
            empty
            onClick={() => {
              onFromChange(undefined)
              onToChange(undefined)
              setFilter(undefined)
            }}
          >
            Clear
          </Button>
          <Button
            disable={!from && !to}
            onClick={() => {
              setFilter({
                startTime: from?.toJSDate().toISOString() || undefined,
                endTime: to?.toJSDate().toISOString() || undefined
              })
              toggleIsFilterOpen()
            }}
          >
            Filter
          </Button>
        </div>
      </div>
    </FilterWrapper>
  )
}

export default DateFilter
