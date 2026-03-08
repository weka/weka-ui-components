import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'

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

  const toggleMonthSelection = useCallback(
    (month: string): void => {
      const updatedMonths = selectedMonths.includes(month)
        ? selectedMonths.filter((m) => m !== month)
        : [...selectedMonths, month]

      onChange(updatedMonths.join(', '))
    },
    [selectedMonths, onChange]
  )

  return (
    <ToggleButton
      isDisabled={isDisabled}
      onChange={toggleMonthSelection}
      options={MONTHS_OPTIONS}
      small
      value={selectedMonths}
      wrapperClass='monthly-picker-wrapper'
    />
  )
}

export default MonthPicker
