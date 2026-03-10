import React from 'react'
import clsx from 'clsx'
import type { DateTime } from 'luxon'

import './DayCell.scss'

interface DayCellProps {
  month: number
  date: DateTime
  selected: boolean
  onSelect: (val?: any) => void
  minDate?: DateTime | null
  maxDate?: DateTime | null
}

function DayCell({
  month,
  date,
  selected,
  onSelect,
  minDate = null,
  maxDate = null
}: DayCellProps) {
  function isDisable() {
    return (
      month !== date.month ||
      (maxDate ? date > maxDate : false) ||
      (minDate ? date < minDate : false)
    )
  }

  const dayClassname = clsx({
    'cell-day': true,
    'cell-day-disabled': isDisable(),
    'cell-day-active': !isDisable(),
    'cell-day-selected': !isDisable() && selected
  })

  function select() {
    if (!isDisable()) {
      onSelect(date)
    }
  }

  return (
    <div
      className={dayClassname}
      onClick={select}
    >
      {date.day}
    </div>
  )
}

export default DayCell
