import React, { FC, useState, useCallback } from 'react'
import { DayPicker, TimePicker } from '../index'
import { Select } from '../../../inputs'
import {
  EVERY_DAY,
  MIDNIGHT,
  SELECT_ALL,
  SPECIFIC_DAYS,
  WEEK_DAYS
} from '../../ScheduleSelectorConsts'

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
  const days = dailyData.days || WEEK_DAYS.MONDAY
  const [isEveryDay, setIsEveryDay] = useState(dailyData.days === SELECT_ALL)

  const handleSelectChange = useCallback(
    (value: string) => {
      setIsEveryDay(value === EVERY_DAY.value)
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
        options={selectOptions}
        value={isEveryDay ? EVERY_DAY.value : SPECIFIC_DAYS.value}
        onChange={handleSelectChange}
        disabled={isDisabled}
      />
      <span className='label-2'>at</span>
      <TimePicker
        value={dailyData.time || MIDNIGHT}
        onChange={handleSelectedTime}
        isDisabled={isDisabled}
      />
      {!isEveryDay && (
        <div className='specific-days-wrapper'>
          <span className='label-2'>on</span>
          <DayPicker
            days={days}
            onChange={handleSelectedDays}
            isDisabled={isDisabled}
          />
        </div>
      )}
    </div>
  )
}

export default DailySelector
