import type { FC } from 'react'
import React, { useCallback } from 'react'

import { Select } from '../../../inputs'
import {
  EVERY_DAY,
  MIDNIGHT,
  SELECT_ALL,
  SPECIFIC_DAYS,
  WEEK_DAYS
} from '../../ScheduleSelectorConsts'
import { DayPicker, TimePicker } from '../index'

import './dailySelector.scss'

const selectOptions = [
  { label: EVERY_DAY.label, value: EVERY_DAY.value },
  { label: SPECIFIC_DAYS.label, value: SPECIFIC_DAYS.value }
]

interface DailySelectorProps {
  dailyData: {
    days: string
    time: string
  }
  onChange: (data: { days: string; time: string }) => void
  isDisabled?: boolean
}

const DailySelector: FC<DailySelectorProps> = ({
  dailyData,
  onChange,
  isDisabled
}) => {
  const isEveryDay = dailyData.days === SELECT_ALL

  const handleSelectChange = useCallback(
    (value: string) => {
      onChange({
        days: value === EVERY_DAY.value ? SELECT_ALL : WEEK_DAYS.MONDAY,
        time: dailyData.time
      })
    },
    [dailyData.time, onChange]
  )

  const handleSelectedTime = useCallback(
    (time: string) => {
      onChange({ days: dailyData.days, time })
    },
    [dailyData.days, onChange]
  )

  const handleSelectedDays = useCallback(
    (days: string) => {
      onChange({ days, time: dailyData.time })
    },
    [dailyData.time, onChange]
  )

  return (
    <div className='daily-selector-wrapper'>
      <Select
        disabled={isDisabled}
        onChange={handleSelectChange}
        options={selectOptions}
        value={isEveryDay ? EVERY_DAY.value : SPECIFIC_DAYS.value}
      />
      <span className='label-2'>at</span>
      <TimePicker
        isDisabled={isDisabled}
        onChange={handleSelectedTime}
        value={dailyData.time || MIDNIGHT}
      />
      {!isEveryDay && (
        <div className='specific-days-wrapper'>
          <span className='label-2'>on</span>
          <DayPicker
            days={dailyData.days || WEEK_DAYS.MONDAY}
            isDisabled={isDisabled}
            onChange={handleSelectedDays}
          />
        </div>
      )}
    </div>
  )
}

export default DailySelector
