import { useMemo, useState } from 'react'
import { DateTime } from 'luxon'

import { ARROW_DIRECTIONS, ArrowIcon } from '../../../../icons'
import { MONTHS, SHORT_DAY_OF_WEEK } from '../../../../utils/consts'
import { getDaysOfTheMonth } from '../../../../utils/timeUtils'
import { DayCell } from '../DayCell'

import styles from './dateSelector.module.scss'

const NOW_KEY = 'now'

export interface DateSelectorProps {
  date: DateTime
  onSubmit: (val?: DateTime) => void
  maxDate?: DateTime | null
  minDate?: DateTime | null
}

export function DateSelector({
  date,
  onSubmit,
  maxDate = null,
  minDate = null
}: Readonly<DateSelectorProps>) {
  const [monthOffset, setMonthOffset] = useState(0)

  const currentMonthYear = useMemo(() => {
    const baseDate = date || DateTime.now()
    return monthOffset === 0 ? baseDate : baseDate.plus({ months: monthOffset })
  }, [date, monthOffset])

  const dateKey = date?.toISODate() ?? NOW_KEY
  const [lastDateKey, setLastDateKey] = useState(dateKey)
  if (dateKey !== lastDateKey) {
    setLastDateKey(dateKey)
    setMonthOffset(0)
  }

  const monthBackward = () => setMonthOffset((prev) => prev - 1)
  const monthForward = () => setMonthOffset((prev) => prev + 1)

  const allDays = getDaysOfTheMonth(currentMonthYear)
  const dateString = `${MONTHS[currentMonthYear.month - 1].toUpperCase()} ${
    currentMonthYear.year
  }`

  const isSelected = (d: DateTime) =>
    d.day === date.day && d.year === date.year && d.month === date.month

  return (
    <div className={styles.datetimeCalendar}>
      <div className={styles.dateToolbar}>
        <div
          className={styles.dateController}
          onClick={monthBackward}
        >
          <ArrowIcon direction={ARROW_DIRECTIONS.LEFT} />
        </div>
        <div>{dateString}</div>
        <div
          className={styles.dateController}
          onClick={monthForward}
        >
          <ArrowIcon direction={ARROW_DIRECTIONS.RIGHT} />
        </div>
      </div>
      <div className={styles.calendarDaysOfWeek}>
        {SHORT_DAY_OF_WEEK.map((txt) => (
          <div
            key={txt}
            className={styles.dayOfWeek}
          >
            {txt.toUpperCase()}
          </div>
        ))}
      </div>
      {allDays.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className={styles.calendarRow}
        >
          {week.map((d) => (
            <DayCell
              key={d.toMillis()}
              date={d}
              maxDate={maxDate}
              minDate={minDate}
              month={currentMonthYear.month}
              onSelect={onSubmit}
              selected={isSelected(d)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
