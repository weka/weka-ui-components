import type { FC } from 'react'
import React, { useCallback } from 'react'

import { EMPTY_STRING, ZERO_STRING } from 'consts'

import {
  DEFAULT_INTERVAL,
  MINUTES_OFFSETS,
  WORK_DAYS
} from '../../ScheduleSelectorConsts'
import { DayPicker, TimePicker } from '../index'

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
            disabled={isDisabled}
            max={60}
            onChange={(e) => handleChangeInterval(Number(e.target.value))}
            type='number'
            value={periodicData.interval || 30}
          />
        </div>
        <span className='label-2'>minutes between</span>
        <TimePicker
          isDisabled={isDisabled}
          onChange={handleStartTimeChange}
          value={periodicData.start_time || ZERO_STRING}
        />
        <span className='label-2'>to</span>
        <TimePicker
          isDisabled={isDisabled}
          onChange={handleEndTimeChange}
          value={periodicData.end_time || ZERO_STRING}
        />
        <span className='label-2'>on</span>
      </div>
      <DayPicker
        days={days}
        isDisabled={isDisabled}
        onChange={handleChangeDays}
      />
    </div>
  )
}

export default PeriodicSelector
