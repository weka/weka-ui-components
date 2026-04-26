import type { DateTime } from 'luxon'

import { isDayDisabled } from '../../utils/dateTimeUtils'

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
  const isDisabled = isDayDisabled(date, month, minDate, maxDate)

  const getClassName = () => {
    if (isDisabled) {
      return styles.cellDayDisabled
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
