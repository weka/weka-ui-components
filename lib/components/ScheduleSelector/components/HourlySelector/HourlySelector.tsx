import type { FC } from 'react'
import React, { useCallback } from 'react'

import { EMPTY_STRING } from 'consts'

import { Select } from '../../../inputs'
import {
  DEFAULT_HOUR,
  EVERY_HOUR,
  SELECT_ALL,
  SPECIFIC_HOURS
} from '../../ScheduleSelectorConsts'
import { DayPicker, HourPicker } from '../'

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
  const isEveryHour = hourlyData.hours === SELECT_ALL
  const specificHours = hourlyData.hours
    ? hourlyData.hours.split(',').map((d) => d.trim())
    : [DEFAULT_HOUR]

  const handleSelectChange = useCallback(
    (value: string) => {
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
          onChange={handleSelectChange}
          options={selectOptions}
          value={isEveryHour ? EVERY_HOUR.value : SPECIFIC_HOURS.value}
        />
        <span className='label-2'>with an offset of</span>
        <div className='input-number'>
          <input
            disabled={isDisabled}
            type='number'
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
            isDisabled={isDisabled}
            onChange={handleDaysChanged}
          />
        </div>
      </div>
      {!isEveryHour && (
        <div className='hourly-picker-wrapper'>
          <HourPicker
            isDisabled={isDisabled}
            minuteOffset={parseInt(hourlyData.minuteOffset, 10)}
            onChange={handleHourToggle}
            selectedHours={specificHours}
            hours={
              hourlyData.hours !== EMPTY_STRING
                ? hourlyData.hours
                : DEFAULT_HOUR
            }
          />
        </div>
      )}
    </>
  )
}

export default HourlySelector
