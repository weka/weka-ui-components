import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

import { useToggle } from 'hooks'
import utils from 'utils'

import Button from '../../../../Button'
import DateTimePicker from '../../../../DateTimePicker'
import type { ExtendedFilterProps } from '../../../types'
import FilterWrapper from '../../FilterWrapper'

import './dateFilter.scss'

export type DateFilterOptions = {
  enableCustomFormat?: boolean
  customFormat?: string
  timezone?: string
}

export interface DateFilterValue {
  startTime?: string
  endTime?: string
}

export const isDateFilterValue = (obj: unknown): obj is DateFilterValue =>
  !!(utils.isObject(obj) && ('startTime' in obj || 'endTime' in obj))

function DateFilter<Data>({
  column,
  filterOptions
}: ExtendedFilterProps<Data, DateFilterValue, DateFilterOptions>) {
  const filterValue = column.getFilterValue()

  if (!isDateFilterValue(filterValue) && filterValue !== undefined) {
    throw new Error('DateFilter: Invalid filter value')
  }

  const { enableCustomFormat, customFormat, timezone } = filterOptions

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

  const fromLabel = timezone ? `FROM (${timezone})` : 'FROM'
  const toLabel = timezone ? `TO (${timezone})` : 'TO'

  return (
    <FilterWrapper
      column={column}
      hideWrapper
      isPopperOpen={isFilterOpen}
      onTogglePopper={toggleIsFilterOpen}
    >
      <div className='date-filter-wrapper'>
        <div>
          <DateTimePicker
            customFormat={customFormat}
            enableCustomFormat={enableCustomFormat}
            label={fromLabel}
            maxDate={to ? to.endOf('day') : DateTime.now()}
            onChange={onFromChange}
            showSeconds
            value={from}
          />
        </div>
        <div>
          <DateTimePicker
            customFormat={customFormat}
            enableCustomFormat={enableCustomFormat}
            label={toLabel}
            minDate={from ? from.startOf('day') : null}
            onChange={onToChange}
            showSeconds
            value={to}
          />
        </div>
        <div className='date-filter-controller'>
          <Button
            disable={!from && !to}
            empty
            onClick={() => {
              onFromChange(undefined)
              onToChange(undefined)
              column.setFilterValue(undefined)
            }}
          >
            Clear
          </Button>
          <Button
            disable={!from && !to}
            onClick={() => {
              column.setFilterValue({
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
