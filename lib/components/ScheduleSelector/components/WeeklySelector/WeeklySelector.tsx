import React, { useCallback } from 'react'
import { Select } from '../../../inputs'
import { TimePicker } from '../'
import { MIDNIGHT, DAYS_OPTIONS } from '../../ScheduleSelectorConsts'

import './weeklySelector.scss'

interface WeeklySelectorProps {
  weeklyData: {
    days: string
    time: string
  }
  onChange: (data: { days: string; time: string }) => void
  isDisabled?: boolean
}

const WeeklySelector: React.FC<WeeklySelectorProps> = ({
  weeklyData,
  onChange,
  isDisabled
}) => {
  const selectedDay = weeklyData.days || DAYS_OPTIONS[0].value
  const time = weeklyData.time || MIDNIGHT

  const handleDayChange = useCallback(
    (day: string) => {
      onChange({ days: day, time })
    },
    [time, onChange]
  )

  const handleTimeChange = useCallback(
    (time: string) => {
      onChange({ days: selectedDay, time })
    },
    [selectedDay, onChange]
  )

  return (
    <div className='weekly-selector-wrapper'>
      <span className='label-2'>Every week at</span>
      <TimePicker
        value={time}
        onChange={handleTimeChange}
        isDisabled={isDisabled}
      />
      <span className='label-2'>on</span>
      <Select
        disabled={isDisabled}
        options={DAYS_OPTIONS}
        onChange={handleDayChange}
        value={selectedDay}
      />
    </div>
  )
}

export default WeeklySelector
