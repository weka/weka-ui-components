import React, { useEffect, useState, useCallback } from 'react'
import { ToggleButton } from '../../../index'
import { Option } from '../../../ToggleButton/ToggleButton'
import { DAYS_OF_WEEK, SELECT_ALL } from '../../ScheduleSelectorConsts'

import './dayPicker.scss'

interface DayPickerProps {
  days: string
  onChange: (days: string) => void
  options?: Option[]
  isDisabled?: boolean
}

const DayPicker = ({ days, onChange, options, isDisabled }: DayPickerProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    days.split(',').map((day) => day.trim())
  )
  const toggleDaySelection = useCallback(
    (day: string): void => {
      if (selectedDays.includes(SELECT_ALL)) {
        setSelectedDays([day])
        return
      }
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      )
    },
    [selectedDays]
  )

  useEffect(() => {
    setSelectedDays(days.split(',').map((day) => day.trim()))
  }, [days])

  useEffect(() => {
    onChange(selectedDays.join(', '))
  }, [selectedDays])

  return (
    <ToggleButton
      options={options || DAYS_OF_WEEK}
      value={selectedDays}
      onChange={toggleDaySelection}
      wrapperClass='day-picker-wrapper'
      isDisabled={isDisabled}
      small
    />
  )
}

export default DayPicker
