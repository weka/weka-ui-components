import React, { useState, FC, useCallback } from 'react'
import { TimePicker, DayPicker } from '../index'
import { EMPTY_STRING, ZERO_STRING } from '../../../../consts'
import {
  WORK_DAYS,
  MINUTES_OFFSETS,
  DEFAULT_INTERVAL
} from '../../ScheduleSelectorConsts'

import './periodicSelector.scss'
import '../../scheduleSelector.scss'

interface PeriodicSelectorProps {
  periodicData: {
    days?: string
    start_time?: string
    end_time?: string
    interval?: number
  }
  onChange: (data: Record<string, any>) => void
  isDisabled?: boolean
}

const PeriodicSelector: FC<PeriodicSelectorProps> = ({
  periodicData,
  onChange,
  isDisabled
}) => {
  const [startTime, setStartTime] = useState(
    periodicData.start_time || EMPTY_STRING
  )
  const [endTime, setEndTime] = useState(periodicData.end_time || EMPTY_STRING)

  const days = periodicData.days || WORK_DAYS

  const handleStartTimeChange = useCallback(
    (time: string) => {
      setStartTime(time)
      const interval = periodicData.interval || DEFAULT_INTERVAL
      const [hours, minutes] = time.split(':').map(Number)
      const newMinutes = minutes + interval

      const adjustedHours = (hours + Math.floor(newMinutes / 60)) % 24
      const adjustedMinutes = newMinutes % 60

      setEndTime(
        `${String(adjustedHours).padStart(2, ZERO_STRING)}:${String(
          adjustedMinutes
        ).padStart(2, ZERO_STRING)}`
      )
      onChange({
        days,
        interval,
        start_time: time,
        end_time: endTime
      })
    },
    [periodicData.interval, days, endTime, onChange]
  )

  const handleChangeInterval = useCallback(
    (interval: number) => {
      if (interval > MINUTES_OFFSETS.MAX) {
        interval = MINUTES_OFFSETS.MAX
      }
      handleStartTimeChange(startTime)
      onChange({
        days,
        interval,
        start_time: startTime,
        end_time: endTime
      })
    },
    [days, endTime, handleStartTimeChange, onChange, startTime]
  )

  const handleChangeDays = useCallback(
    (days: string) => {
      onChange({
        days,
        interval: periodicData.interval || MINUTES_OFFSETS.DEFAULT,
        start_time: startTime,
        end_time: endTime
      })
    },
    [periodicData.interval, startTime, endTime, onChange]
  )

  const handleEndTimeChange = useCallback(
    (time: string) => {
      setEndTime(time)
      onChange({
        days,
        interval: periodicData.interval || DEFAULT_INTERVAL,
        start_time: startTime,
        end_time: time
      })
    },
    [days, periodicData.interval, startTime, onChange]
  )

  return (
    <div className='periodic-selector-container'>
      <div className='periodic-selector-container-content'>
        <span className='label-2'>Every</span>
        <div className='input-number'>
          <input
            type='number'
            max={60}
            disabled={isDisabled}
            value={periodicData.interval || 30}
            onChange={(e) => handleChangeInterval(Number(e.target.value))}
          />
        </div>
        <span className='label-2'>minutes between</span>
        <TimePicker
          value={startTime}
          onChange={handleStartTimeChange}
          isDisabled={isDisabled}
        />
        <span className='label-2'>to</span>
        <TimePicker
          value={endTime}
          onChange={handleEndTimeChange}
          isDisabled={isDisabled}
        />
        <span className='label-2'>on</span>
      </div>
      <DayPicker
        days={days}
        onChange={handleChangeDays}
        isDisabled={isDisabled}
      />
    </div>
  )
}

export default PeriodicSelector
