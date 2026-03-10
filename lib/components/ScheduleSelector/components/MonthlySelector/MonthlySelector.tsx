import type { FC } from 'react'
import React, { useCallback, useEffect, useMemo } from 'react'
import clsx from 'clsx'

import { Select } from '../../../inputs'
import {
  EVERY_MONTH,
  MIDNIGHT,
  MINIMAL_DAYS_OF_MONTH,
  MONTHS,
  MONTHS_OPTIONS,
  SELECT_ALL,
  SPECIFIC_MONTH
} from '../../ScheduleSelectorConsts'
import { DayPicker, MonthPicker, TimePicker } from '../index'

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
      const updatedDays = everyMonth
        ? monthlyData.days
        : monthlyData.days
            .split(',')
            .filter((day) => parseInt(day, 10) <= MINIMAL_DAYS_OF_MONTH)
            .join(',')

      onChange({
        months: value === EVERY_MONTH.value ? SELECT_ALL : MONTHS.JANUARY,
        time,
        days: updatedDays
      })
    },
    [everyMonth, monthlyData.days, onChange, time]
  )

  const handleTimeChange = useCallback(
    (time: string) => {
      onChange({ months: monthlyData.months, time, days: monthlyData.days })
    },
    [monthlyData.days, monthlyData.months, onChange]
  )

  const handleMonthChange = useCallback(
    (months: string) => {
      const selectedMonths = months
        .split(',')
        .map((month) => month.trim().toLowerCase())
        .filter(Boolean)
      const validMonths =
        selectedMonths.length > 0
          ? selectedMonths
          : [MONTHS.JANUARY.toLowerCase()]
      const minDays = Math.min(
        ...validMonths.map(
          (month) =>
            MONTHS_OPTIONS.find((m) => m.value === month)?.days ||
            MINIMAL_DAYS_OF_MONTH
        )
      )

      const validDays = monthlyData.days
        .split(',')
        .map((day) => day.trim())
        .filter((day) => parseInt(day) <= minDays)
        .join(',')

      onChange({ months: validMonths.join(','), time, days: validDays })
    },
    [monthlyData.days, time, onChange]
  )

  const applyDaysChange = (days: string) => {
    const selectedDays = days
      .split(',')
      .map((day) => day.trim())
      .filter(Boolean)

    const months = monthlyData.months
      .split(',')
      .map((month) => month.trim().toLowerCase())
    const maxDays = everyMonth
      ? MINIMAL_DAYS_OF_MONTH
      : Math.min(
          ...months.map(
            (month) =>
              MONTHS_OPTIONS.find((m) => m.value === month)?.days ||
              MINIMAL_DAYS_OF_MONTH
          )
        )
    const validDays = selectedDays.filter((day) => parseInt(day, 10) <= maxDays)
    const finalDays = validDays.length > 0 ? validDays : ['01']

    onChange({
      months: monthlyData.months,
      time,
      days: finalDays.join(',')
    })
  }

  useEffect(() => {
    applyDaysChange(monthlyData.days)
  }, [monthlyData.months])

  const handleDateChange = useCallback(
    (days: string) => {
      applyDaysChange(days)
    },
    [monthlyData.months, time, everyMonth, onChange]
  )

  const daysOfMonth = useMemo(() => {
    const months = monthlyData.months
      .split(',')
      .map((month) => month.trim().toLowerCase())
    const maxDays = everyMonth
      ? MINIMAL_DAYS_OF_MONTH
      : Math.min(
          ...months.map(
            (month) =>
              MONTHS_OPTIONS.find((m) => m.value === month)?.days ||
              MINIMAL_DAYS_OF_MONTH
          )
        )
    return Array.from({ length: maxDays }, (_, i) => {
      const day = (i + 1).toString()
      return {
        label: day,
        value: day.padStart(2, '0')
      }
    })
  }, [monthlyData.months])

  const getDaysClass = (months: string) => {
    const selectedMonths = months
      .split(',')
      .map((month) => month.trim().toLowerCase())
    const daysInSelectedMonths = selectedMonths.map(
      (month) =>
        MONTHS_OPTIONS.find((m) => m.value === month)?.days ||
        MINIMAL_DAYS_OF_MONTH
    )

    if (
      selectedMonths.includes(SELECT_ALL) ||
      daysInSelectedMonths.includes(MINIMAL_DAYS_OF_MONTH)
    ) {
      return 'every-month-days'
    }
    if (daysInSelectedMonths.includes(30)) {
      return 'specific-month-30-days'
    }
    if (daysInSelectedMonths.includes(31)) {
      return 'specific-month-31-days'
    }
    return 'every-month-days'
  }

  const breakpointIndex = useMemo(
    () => Math.ceil(daysOfMonth.length / 2),
    [daysOfMonth]
  )

  return (
    <>
      <div className='monthly-selector-wrapper'>
        <div className='monthly-selector-content'>
          <Select
            disabled={isDisabled}
            onChange={handleSelectChange}
            options={selectOptions}
            value={everyMonth ? EVERY_MONTH.value : SPECIFIC_MONTH.value}
          />
          <span className='label-2'>at</span>
          <TimePicker
            isDisabled={isDisabled}
            onChange={handleTimeChange}
            value={time}
          />
          <span className='label-2'>on</span>
        </div>
        <div
          className={clsx(
            'day-picker-wrapper',
            getDaysClass(monthlyData.months)
          )}
        >
          <DayPicker
            breakpointIndex={breakpointIndex}
            days={monthlyData.days}
            isDisabled={isDisabled}
            onChange={handleDateChange}
            options={daysOfMonth}
          />
        </div>
      </div>
      {!everyMonth && (
        <div className='monthly-picker-wrapper'>
          <MonthPicker
            isDisabled={isDisabled}
            months={monthlyData.months}
            onChange={handleMonthChange}
          />
        </div>
      )}
    </>
  )
}

export default MonthlySelector
