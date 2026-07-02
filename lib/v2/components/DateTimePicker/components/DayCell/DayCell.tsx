import type { DateTime } from 'luxon'

import {
  isDayOutOfBounds,
  isDayOutsideMonth
} from '../../utils/dateTimeUtils'

import styles from './dayCell.module.scss'

export interface DayCellProps {
  month: number
  date: DateTime
  selected: boolean
  onSelect: (val: DateTime) => void
  minDate?: DateTime | null
  maxDate?: DateTime | null
}

export function DayCell({
  month,
  date,
  selected,
  onSelect,
  minDate = null,
  maxDate = null
}: Readonly<DayCellProps>) {
  const outOfBounds = isDayOutOfBounds(date, minDate, maxDate)
  const outsideMonth = isDayOutsideMonth(date, month)
  const isDisabled = outOfBounds || outsideMonth

  const getClassName = () => {
    if (outOfBounds) {
      return styles.cellDayDisabled
    }
    if (outsideMonth) {
      return styles.cellDayOutsideMonth
    }
    if (selected) {
      return styles.cellDaySelected
    }
    return styles.cellDayActive
  }

  const select = () => {
    if (!isDisabled) {
      onSelect(date)
    }
  }

  return (
    <div
      className={getClassName()}
      onClick={select}
    >
      {date.day}
    </div>
  )
}
