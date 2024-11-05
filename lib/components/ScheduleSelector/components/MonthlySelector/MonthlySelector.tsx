import React, { FC, useCallback, useMemo } from 'react'
import { Select } from '../../../inputs'
import { TimePicker, DayPicker, MonthPicker } from '../index'
import {
  EVERY_MONTH,
  MIDNIGHT,
  SELECT_ALL,
  MONTHS,
  SPECIFIC_MONTH
} from '../../ScheduleSelectorConsts'
import { ZERO_STRING } from '../../../../consts'

import './monthlySelector.scss'

const selectOptions = [
  { label: EVERY_MONTH.label, value: EVERY_MONTH.value },
  { label: SPECIFIC_MONTH.label, value: SPECIFIC_MONTH.value }
]

interface MonthlySelectorProps {
  monthlyData: {
    months: string
    time: string
    days: string
  }
  onChange: (data: { months: string; time: string; days: string }) => void
  isDisabled?: boolean
}

const MonthlySelector: FC<MonthlySelectorProps> = ({
  monthlyData,
  onChange,
  isDisabled
}) => {
  const everyMonth = monthlyData.months === SELECT_ALL
  const time = monthlyData.time || MIDNIGHT

  const handleSelectChange = useCallback(
    (value: string) => {
      onChange({
        months: value === EVERY_MONTH.value ? SELECT_ALL : MONTHS.JANUARY,
        time,
        days: monthlyData.days
      })
    },
    [monthlyData.days, time, onChange]
  )

  const handleTimeChange = useCallback(
    (time: string) => {
      onChange({ months: monthlyData.months, time, days: monthlyData.days })
    },
    [monthlyData.days, monthlyData.months, onChange]
  )

  const handleMonthChange = useCallback(
    (months: string) => {
      onChange({ months, time, days: monthlyData.days })
    },
    [monthlyData.days, time, onChange]
  )

  const handleDateChange = useCallback(
    (days: string) => {
      onChange({ months: monthlyData.months, time, days })
    },
    [monthlyData.months, time, onChange]
  )

  const daysOfMonth = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const day = (i + 1).toString()
        return {
          label: day,
          value: day.padStart(2, ZERO_STRING)
        }
      }),
    []
  )

  return (
    <>
      <div className='monthly-selector-wrapper'>
        <div className='monthly-selector-content'>
          <Select
            options={selectOptions}
            value={everyMonth ? EVERY_MONTH.value : SPECIFIC_MONTH.value}
            onChange={handleSelectChange}
            disabled={isDisabled}
          />
          <span className='label-2'>at</span>
          <TimePicker
            value={time}
            onChange={handleTimeChange}
            isDisabled={isDisabled}
          />
          <span className='label-2'>on</span>
        </div>
        <DayPicker
          days={monthlyData.days}
          onChange={handleDateChange}
          options={daysOfMonth}
          isDisabled={isDisabled}
        />
      </div>
      {!everyMonth && (
        <div className='monthly-picker-wrapper'>
          <MonthPicker
            months={monthlyData.months}
            onChange={handleMonthChange}
            isDisabled={isDisabled}
          />
        </div>
      )}
    </>
  )
}

export default MonthlySelector
