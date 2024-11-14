import React, { FC, useMemo } from 'react'
import { ToggleButton } from '../../../index'
import { MONTHS_OPTIONS } from '../../ScheduleSelectorConsts'

import './monthPicker.scss'

interface MonthPickerProps {
  months: string
  onChange: (time: string) => void
  isDisabled?: boolean
}

const MonthPicker: FC<MonthPickerProps> = ({
  months,
  onChange,
  isDisabled
}) => {
  const selectedMonths = useMemo(
    () => months.split(',').map((month) => month.trim()),
    [months]
  )

  const toggleMonthSelection = (month: string): void => {
    const updatedMonths = selectedMonths.includes(month)
      ? selectedMonths.filter((m) => m !== month)
      : [...selectedMonths, month]

    onChange(updatedMonths.join(', '))
  }

  return (
    <ToggleButton
      options={MONTHS_OPTIONS}
      value={selectedMonths}
      onChange={toggleMonthSelection}
      wrapperClass='monthly-picker-wrapper'
      isDisabled={isDisabled}
      small
    />
  )
}

export default MonthPicker
