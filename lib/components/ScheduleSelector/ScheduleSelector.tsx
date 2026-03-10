import type { FC } from 'react'
import React, { useCallback } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'

import {
  DailySelector,
  HourlySelector,
  MonthlySelector,
  PeriodicSelector,
  WeeklySelector
} from './components'
import { SCHEDULER_TYPES } from './ScheduleSelectorConsts'
import type { ScheduleData } from './types'

interface ScheduleSelectorProps {
  type: string
  scheduleData: ScheduleData
  onChange: (type: string, data: Record<string, string | number>) => void
  isDisabled?: boolean
  wrapperClass?: string
}

const ScheduleSelector: FC<ScheduleSelectorProps> = ({
  type,
  scheduleData,
  onChange,
  isDisabled,
  wrapperClass = EMPTY_STRING
}) => {
  const handleUpdate = useCallback(
    (data: Record<string, string | number>) => {
      onChange(type, data)
    },
    [onChange, type]
  )

  return (
    <div
      className={clsx({
        [wrapperClass]: true,
        'schedule-selector-wrapper': true
      })}
    >
      {type === SCHEDULER_TYPES.PERIODIC && (
        <PeriodicSelector
          isDisabled={isDisabled}
          onChange={handleUpdate}
          periodicData={scheduleData.periodic}
        />
      )}
      {type === SCHEDULER_TYPES.HOURLY && (
        <HourlySelector
          hourlyData={scheduleData.hourly}
          isDisabled={isDisabled}
          onChange={handleUpdate}
        />
      )}
      {type === SCHEDULER_TYPES.DAILY && (
        <DailySelector
          dailyData={scheduleData.daily}
          isDisabled={isDisabled}
          onChange={handleUpdate}
        />
      )}
      {type === SCHEDULER_TYPES.WEEKLY && (
        <WeeklySelector
          isDisabled={isDisabled}
          onChange={handleUpdate}
          weeklyData={scheduleData.weekly}
        />
      )}
      {type === SCHEDULER_TYPES.MONTHLY && (
        <MonthlySelector
          isDisabled={isDisabled}
          monthlyData={scheduleData.monthly}
          onChange={handleUpdate}
        />
      )}
    </div>
  )
}

export default ScheduleSelector
