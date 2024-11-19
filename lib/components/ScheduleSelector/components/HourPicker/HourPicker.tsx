import React, { useMemo, useCallback } from 'react'
import { ToggleButton } from '../../../index'
import { ZERO_STRING } from '~consts'

import './hourPicker.scss'

interface TimeOption {
  value: string
  label: string
}

interface HourPickerProps {
  hours: string
  minuteOffset: number
  selectedHours: string[]
  onChange: (hours: string[]) => void
  isDisabled?: boolean
}

const HourPicker: React.FC<HourPickerProps> = ({
  hours,
  minuteOffset,
  selectedHours,
  onChange,
  isDisabled
}) => {
  const parseHours = useMemo(() => {
    return (hours: string): string[] =>
      hours?.split(',').map((hour) => hour.trim()) || []
  }, [])

  const parsedHours = useMemo(() => parseHours(hours), [hours, parseHours])

  const generateHourlyOptions = useCallback(
    (startHour: number, offset: number): TimeOption[] => {
      const options: TimeOption[] = []
      for (let i = 0; i < 24; i++) {
        const hour = (startHour + i) % 24
        const hourString = hour.toString().padStart(2, ZERO_STRING)
        const minuteString = offset.toString().padStart(2, ZERO_STRING)
        options.push({
          value: `${hourString}:${minuteString}`,
          label: `${hourString}:${minuteString}`
        })
      }
      return options
    },
    []
  )

  const hourOptions = useMemo(
    () => generateHourlyOptions(9, minuteOffset),
    [minuteOffset, generateHourlyOptions]
  )

  const initialSelectedHours = useMemo(
    () =>
      hourOptions
        .filter((option) => parsedHours.includes(option.value.split(':')[0]))
        .map((option) => option.value),
    [hourOptions, parsedHours]
  )

  const handleHourToggle = useCallback(
    (hour: string): void => {
      const parsedHour = hour.split(':')[0].padStart(2, ZERO_STRING)
      const updatedSelections = selectedHours.includes(parsedHour)
        ? selectedHours.filter((h) => h !== parsedHour)
        : [...selectedHours, parsedHour]

      onChange(updatedSelections)
    },
    [selectedHours, onChange]
  )

  return (
    <ToggleButton
      options={hourOptions}
      value={initialSelectedHours}
      onChange={handleHourToggle}
      wrapperClass='hour-picker-wrapper'
      isDisabled={isDisabled}
      small
    />
  )
}

export default HourPicker
