import React, { useState } from 'react'
import Button from '../../../Button'
import { DateTime } from 'luxon'
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
          onSubmit={showTime ? setDateTime : onSubmit}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
      {showTime ? (
        <>
          <div>
            <TimeSelector
              time={dateTime}
              onSubmit={setDateTime}
              showSeconds={showSeconds}
              onNowSubmit={onSubmit}
              showNow={showNow}
            />
          </div>
          <div className='calendar-actions'>
            <div className='calendar-actions-sub'>
              {canClear && (
                <Button empty onClick={() => onSubmit(undefined)}>
                  Clear
                </Button>
              )}
              <Button onClick={() => onSubmit(dateTime)}>OK</Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default DateTimeCalendar
