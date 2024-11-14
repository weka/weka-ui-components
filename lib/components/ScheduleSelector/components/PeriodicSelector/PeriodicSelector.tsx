import React, { FC, useCallback } from 'react'
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
  const days = periodicData.days || WORK_DAYS

  const handleChangeInterval = useCallback(
    (interval: number) => {
      if (interval > MINUTES_OFFSETS.MAX) {
        interval = MINUTES_OFFSETS.MAX
      }
      onChange({
        days,
        interval,
        start_time: periodicData.start_time || EMPTY_STRING,
        end_time: periodicData.end_time || EMPTY_STRING
      })
    },
    [days, onChange]
  )

  const handleChangeDays = useCallback(
    (days: string) => {
      onChange({
        days,
        interval: periodicData.interval || MINUTES_OFFSETS.DEFAULT,
        start_time: periodicData.start_time || EMPTY_STRING,
        end_time: periodicData.end_time || EMPTY_STRING
      })
    },
    [periodicData.interval, onChange]
  )

  const handleEndTimeChange = useCallback(
    (time: string) => {
      onChange({
        days,
        interval: periodicData.interval || DEFAULT_INTERVAL,
        start_time: periodicData.start_time || EMPTY_STRING,
        end_time: time
      })
    },
    [days, periodicData.interval, onChange]
  )

  const handleStartTimeChange = useCallback(
    (time: string) => {
      onChange({
        days,
        interval: periodicData.interval || DEFAULT_INTERVAL,
        start_time: time,
        end_time: periodicData.end_time || EMPTY_STRING
      })
    },
    [days, periodicData.interval, onChange]
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
          value={periodicData.start_time || ZERO_STRING}
          onChange={handleStartTimeChange}
          isDisabled={isDisabled}
        />
        <span className='label-2'>to</span>
        <TimePicker
          value={periodicData.end_time || ZERO_STRING}
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
