import React, { useState, FC, useEffect, useCallback } from 'react'
import { DayPicker, HourPicker } from '../'
import { Select } from '../../../inputs'
import { EMPTY_STRING } from '../../../../consts'
import {
  SPECIFIC_HOURS,
  EVERY_HOUR,
  SELECT_ALL,
  DEFAULT_HOUR
} from '../../ScheduleSelectorConsts'

import './hourlySelector.scss'
import '../../scheduleSelector.scss'

const selectOptions = [
  { label: EVERY_HOUR.label, value: EVERY_HOUR.value },
  { label: SPECIFIC_HOURS.label, value: SPECIFIC_HOURS.value }
]

interface HourlySelectorProps {
  hourlyData: {
    hours: string
    minuteOffset: string
    days?: string
  }
  onChange: (data: {
    hours: string
    minuteOffset: string
    days?: string
  }) => void
  isDisabled?: boolean
}

const HourlySelector: FC<HourlySelectorProps> = ({
  hourlyData,
  onChange,
  isDisabled
}) => {
  const [specificHours, setSpecificHours] = useState<string[]>(
    hourlyData.hours ? hourlyData.hours.split(',') : [DEFAULT_HOUR]
  )
  const [isEveryHour, setIsEveryHour] = useState(
    hourlyData.hours === SELECT_ALL
  )

  useEffect(() => {
    setSpecificHours(
      hourlyData.hours && hourlyData.hours !== ''
        ? hourlyData.hours.split(',').map((d) => d.trim())
        : [DEFAULT_HOUR]
    )
    setIsEveryHour(hourlyData.hours === SELECT_ALL)
  }, [hourlyData])

  const handleSelectChange = useCallback(
    (value: string) => {
      setIsEveryHour(value === EVERY_HOUR.value)
      onChange({
        hours: value === EVERY_HOUR.value ? SELECT_ALL : DEFAULT_HOUR,
        minuteOffset: hourlyData.minuteOffset,
        days: hourlyData.days
      })
    },
    [hourlyData.minuteOffset, hourlyData.days, onChange]
  )

  const handleHourToggle = useCallback(
    (hours: string[]) => {
      setSpecificHours(hours)
      onChange({
        hours: hours.join(','),
        minuteOffset: hourlyData.minuteOffset,
        days: hourlyData.days
      })
    },
    [hourlyData.minuteOffset, hourlyData.days, onChange]
  )

  const handleDaysChanged = useCallback(
    (days: string) => {
      onChange({
        hours: hourlyData.hours,
        minuteOffset: hourlyData.minuteOffset,
        days
      })
    },
    [hourlyData.hours, hourlyData.minuteOffset, onChange]
  )

  return (
    <>
      <div className='hourly-selector-wrapper'>
        <Select
          disabled={isDisabled}
          options={selectOptions}
          value={isEveryHour ? EVERY_HOUR.value : SPECIFIC_HOURS.value}
          onChange={handleSelectChange}
        />
        <span className='label-2'>with an offset of</span>
        <div className='input-number'>
          <input
            type='number'
            disabled={isDisabled}
            value={hourlyData.minuteOffset || 0}
            onChange={(e) => {
              const minuteOffset =
                e.target.value === EMPTY_STRING
                  ? 0
                  : Math.min(parseInt(e.target.value, 10), 59)
              onChange({
                hours: hourlyData.hours,
                minuteOffset: String(minuteOffset),
                days: hourlyData.days
              })
            }}
          />
        </div>
        <span className='label-2'>minutes</span>
        <div className='specific-days-wrapper'>
          <span className='label-2'>on</span>
          <DayPicker
            days={hourlyData.days || SELECT_ALL}
            onChange={handleDaysChanged}
            isDisabled={isDisabled}
          />
        </div>
      </div>
      {!isEveryHour && (
        <div className='hourly-picker-wrapper'>
          <HourPicker
            hours={hourlyData.hours !== '' ? hourlyData.hours : DEFAULT_HOUR}
            onChange={handleHourToggle}
            minuteOffset={parseInt(hourlyData.minuteOffset, 10)}
            selectedHours={specificHours}
            isDisabled={isDisabled}
          />
        </div>
      )}
    </>
  )
}

export default HourlySelector
