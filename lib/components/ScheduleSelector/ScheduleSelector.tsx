import React, { useCallback, FC } from 'react'
import clsx from 'clsx'
import {
  PeriodicSelector,
  HourlySelector,
  DailySelector,
  WeeklySelector,
  MonthlySelector
} from './components'
import { ScheduleData } from './types'
import { SCHEDULER_TYPES } from './ScheduleSelectorConsts'
import { EMPTY_STRING } from '../../consts'

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
          periodicData={scheduleData.periodic}
          onChange={handleUpdate}
          isDisabled={isDisabled}
        />
      )}
      {type === SCHEDULER_TYPES.HOURLY && (
        <HourlySelector
          hourlyData={scheduleData.hourly}
          onChange={handleUpdate}
          isDisabled={isDisabled}
        />
      )}
      {type === SCHEDULER_TYPES.DAILY && (
        <DailySelector
          dailyData={scheduleData.daily}
          onChange={handleUpdate}
          isDisabled={isDisabled}
        />
      )}
      {type === SCHEDULER_TYPES.WEEKLY && (
        <WeeklySelector
          weeklyData={scheduleData.weekly}
          onChange={handleUpdate}
          isDisabled={isDisabled}
        />
      )}
      {type === SCHEDULER_TYPES.MONTHLY && (
        <MonthlySelector
          monthlyData={scheduleData.monthly}
          onChange={handleUpdate}
          isDisabled={isDisabled}
        />
      )}
    </div>
  )
}

export default ScheduleSelector
