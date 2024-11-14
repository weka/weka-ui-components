import React, { useMemo } from 'react'
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
  const allDays = useMemo(
    () => (options || DAYS_OF_WEEK).map((day) => day.value),
    [options]
  )

  const selectedDays =
    days === SELECT_ALL ? allDays : days.split(',').map((day) => day.trim())

  const toggleDaySelection = (day: string): void => {
    if (selectedDays.includes(SELECT_ALL)) {
      onChange(day)
      return
    }

    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day]

    onChange(updatedDays.join(', '))
  }

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
