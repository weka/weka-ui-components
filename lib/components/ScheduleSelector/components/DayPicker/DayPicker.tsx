import React, { useCallback, useMemo } from 'react'
import { ToggleButton } from '../../../index'
import { Option } from '../../../ToggleButton/ToggleButton'
import {
  DAYS_OF_WEEK,
  SELECT_ALL,
  WEEK_DAYS
} from '../../ScheduleSelectorConsts'

import './dayPicker.scss'

interface DayPickerProps {
  days: string
  onChange: (days: string) => void
  options?: Option[]
  isDisabled?: boolean
  breakpointIndex?: number
}

const DayPicker = ({
  days,
  onChange,
  options,
  isDisabled,
  breakpointIndex
}: DayPickerProps) => {
  const allDays = useMemo(
    () => (options || DAYS_OF_WEEK).map((day) => day.value),
    [options]
  )

  const selectedDays = useMemo(() => {
    if (!days) {
      return [WEEK_DAYS.MONDAY]
    }
    if (days === SELECT_ALL) {
      return allDays
    }
    const parsedDays = days.split(',').map((day) => day.trim())
    return parsedDays.length ? parsedDays : [WEEK_DAYS.MONDAY]
  }, [days, allDays])

  const toggleDaySelection = useCallback(
    (day: string): void => {
      if (day === SELECT_ALL) {
        onChange(
          selectedDays.length === allDays.length ? WEEK_DAYS.MONDAY : SELECT_ALL
        )
        return
      }
      const updatedDays = selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day]
      const finalDays =
        updatedDays.length === 0
          ? WEEK_DAYS.MONDAY
          : updatedDays.length === allDays.length
          ? SELECT_ALL
          : updatedDays.join(', ')

      onChange(finalDays)
    },
    [selectedDays, allDays, onChange]
  )

  return (
    <ToggleButton
      options={options || DAYS_OF_WEEK}
      value={selectedDays.includes(SELECT_ALL) ? [SELECT_ALL] : selectedDays}
      onChange={toggleDaySelection}
      wrapperClass='day-picker-wrapper'
      isDisabled={isDisabled}
      small
      breakpointIndex={breakpointIndex}
    />
  )
}

export default DayPicker
