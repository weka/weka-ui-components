import { useState } from 'react'
import { DateTime } from 'luxon'

import { Button } from '../../../Button'
import { DateSelector } from '../DateSelector'
import { TimeSelector } from '../TimeSelector'

import styles from './dateTimeCalendar.module.scss'

export interface DateTimeCalendarProps {
  onSubmit: (val?: DateTime) => void
  initValue?: DateTime
  minDate?: DateTime | null
  maxDate?: DateTime | null
  showSeconds?: boolean
  showTime?: boolean
  canClear?: boolean
  showNow?: boolean
}

export function DateTimeCalendar({
  onSubmit,
  initValue = DateTime.now(),
  minDate = null,
  maxDate = null,
  showSeconds = true,
  showTime = true,
  canClear = true,
  showNow
}: Readonly<DateTimeCalendarProps>) {
  const [dateTime, setDateTime] = useState(initValue)

  const handleDateSelect = (val?: DateTime) => {
    if (val) {
      setDateTime(val)
    }
  }

  return (
    <div className={styles.calendarWrapper}>
      <div>
        <DateSelector
          date={dateTime}
          maxDate={maxDate}
          minDate={minDate}
          onSubmit={showTime ? handleDateSelect : onSubmit}
        />
      </div>
      {showTime ? (
        <>
          <div>
            <TimeSelector
              maxDate={maxDate}
              minDate={minDate}
              onNowSubmit={onSubmit}
              onSubmit={setDateTime}
              showNow={showNow}
              showSeconds={showSeconds}
              time={dateTime}
            />
          </div>
          <div className={styles.calendarActions}>
            <div className={styles.calendarActionsSub}>
              {canClear ? (
                <Button onClick={() => onSubmit(undefined)}>Clear</Button>
              ) : null}
              <Button onClick={() => onSubmit(dateTime)}>OK</Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
