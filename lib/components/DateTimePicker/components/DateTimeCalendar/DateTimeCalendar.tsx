import React, { useState } from 'react'
import { DateTime } from 'luxon'

import Button from '../../../Button'
import DateSelector from '../DateSelector'
import TimeSelector from '../TimeSelector'

import './dateTimeCalendar.scss'

interface DateTimeCalendarProps {
  onSubmit: (val?: any) => void
  initValue?: DateTime
  minDate?: DateTime | null
  maxDate?: DateTime | null
  showSeconds?: boolean
  showTime?: boolean
  canClear?: boolean
  showNow?: boolean
}

function DateTimeCalendar({
  onSubmit,
  initValue = DateTime.now(),
  minDate = null,
  maxDate = null,
  showSeconds = true,
  showTime = true,
  canClear = true,
  showNow
}: DateTimeCalendarProps) {
  const [dateTime, setDateTime] = useState(initValue)
  return (
    <div className='calendar-wrapper'>
      <div>
        <DateSelector
          date={dateTime}
          maxDate={maxDate}
          minDate={minDate}
          onSubmit={showTime ? setDateTime : onSubmit}
        />
      </div>
      {showTime ? (
        <>
          <div>
            <TimeSelector
              onNowSubmit={onSubmit}
              onSubmit={setDateTime}
              showNow={showNow}
              showSeconds={showSeconds}
              time={dateTime}
            />
          </div>
          <div className='calendar-actions'>
            <div className='calendar-actions-sub'>
              {canClear ? (
                <Button
                  empty
                  onClick={() => onSubmit(undefined)}
                >
                  Clear
                </Button>
              ) : null}
              <Button onClick={() => onSubmit(dateTime)}>OK</Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default DateTimeCalendar
