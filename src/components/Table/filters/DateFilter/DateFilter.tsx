import React, { useState } from 'react'
import { DateTime } from 'luxon'
import Button from '../../../Button'
import DateTimePicker from '../../../DateTimePicker'

import './dateFilter.scss'

interface DateFilterDefault {
  startTime?: string
  endTime?: string
}

interface DateFilter {
  start_time?: string
  end_time?: string
}

interface DateFilterProps {
  setFilter: (filter: DateFilter) => void
  defaultValue?: DateFilterDefault
}

function DateFilter(props: DateFilterProps) {
  const { setFilter, defaultValue } = props
  const [from, onFromChange] = useState(
    defaultValue?.startTime
      ? DateTime.fromISO(defaultValue.startTime)
      : undefined
  )
  const [to, onToChange] = useState(
    defaultValue?.endTime ? DateTime.fromISO(defaultValue.endTime) : undefined
  )

  const onClick = () => {
    setFilter({
      start_time: from?.toJSDate().toISOString() || undefined,
      end_time: to?.toJSDate().toISOString() || undefined
    })
  }

  return (
    <div className='date-filter-wrapper'>
      <div>
        <DateTimePicker
          onChange={onFromChange}
          value={from}
          label='FROM'
          maxDate={to ? to.endOf('day') : DateTime.now()}
          showSeconds
          disablePortal
        />
      </div>
      <div>
        <DateTimePicker
          onChange={onToChange}
          value={to}
          label='TO'
          minDate={from && from.startOf('day')}
          showSeconds
          disablePortal
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
        <Button disable={!from && !to} onClick={onClick}>
          Filter
        </Button>
      </div>
    </div>
  )
}

export default DateFilter
