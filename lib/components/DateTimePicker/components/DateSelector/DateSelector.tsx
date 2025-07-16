import React, { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import { MONTHS, SHORT_DAY_OF_WEEK } from 'consts'
import svgs from 'svgs'
import DayCell from '../DayCell/DayCell'

import './DateSelector.scss'

const { Arrow } = svgs

interface DateSelectorProps {
  date: DateTime
  onSubmit: (val?: any) => void
  maxDate?: DateTime | null
  minDate?: DateTime | null
}

function getDaysOfTheMonth(referenceDate) {
  const startDate = DateTime.local(referenceDate.year, referenceDate.month)
  let fromDate = startDate.minus({ day: startDate.weekday - 1 })
  const endDate = DateTime.local(referenceDate.year, referenceDate.month).plus({
    month: 1
  })
  const toDate = endDate.plus({ day: 7 - endDate.weekday })
  const monthDaysByWeek = []
  let daysOfWeek = []
  while (fromDate <= toDate) {
    const appendDate = fromDate.set({
      hour: referenceDate.hour,
      minute: referenceDate.minute,
      second: referenceDate.second
    })
    daysOfWeek.push(appendDate)
    if (fromDate.weekday === 7) {
      monthDaysByWeek.push(daysOfWeek)
      daysOfWeek = []
    }
    fromDate = fromDate.plus({ day: 1 })
  }
  return monthDaysByWeek
}

function DateSelector(props: DateSelectorProps) {
  const { date, onSubmit, maxDate = null, minDate = null } = props

  const [currentMonthYear, setCurrentMonthYear] = useState(
    date || DateTime.now()
  )

  useEffect(() => {
    setCurrentMonthYear(date || DateTime.now())
  }, [date])

  function monthBackward() {
    setCurrentMonthYear(currentMonthYear.minus({ month: 1 }))
  }

  function monthForward() {
    setCurrentMonthYear(currentMonthYear.plus({ month: 1 }))
  }

  const allDays = getDaysOfTheMonth(currentMonthYear)
  const dateString = `${MONTHS[currentMonthYear.month - 1].toUpperCase()} ${
    currentMonthYear.year
  }`

  function isSelected(d) {
    return d.day === date.day && d.year === date.year && d.month === date.month
  }

  return (
    <div className='datetime-calendar'>
      <div className='date-toolbar'>
        <div className='date-controller' onClick={monthBackward}>
          <Arrow className='rotate90' />
        </div>
        <div>{dateString}</div>
        <div className='date-controller' onClick={monthForward}>
          <Arrow className='rotate270' />
        </div>
      </div>
      <div className='calendar-days-of-week'>
        {SHORT_DAY_OF_WEEK.map((txt) => (
          <div key={txt} className='day-of-week'>
            {txt.toUpperCase()}
          </div>
        ))}
      </div>
      {allDays.map((w) => (
        <div key={w} className='calendar-row'>
          {w.map((d) => (
            <DayCell
              minDate={minDate}
              maxDate={maxDate}
              onSelect={onSubmit}
              key={d}
              date={d}
              selected={isSelected(d)}
              month={currentMonthYear.month}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default DateSelector
