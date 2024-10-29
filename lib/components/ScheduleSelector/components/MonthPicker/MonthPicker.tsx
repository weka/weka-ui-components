import React, { useState, FC, useEffect, useCallback } from 'react'
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
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    months.split(',').map((month) => month.trim())
  )
  const toggleMonthSelection = useCallback((month: string): void => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    )
  }, [])

  useEffect(() => {
    onChange(selectedMonths.join(', '))
  }, [selectedMonths])

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
