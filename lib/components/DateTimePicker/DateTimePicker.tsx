import React, { useRef, useState } from 'react'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import clsx from 'clsx'
import type { DateTime } from 'luxon'

import { EMPTY_STRING } from 'consts'
import svgs from 'svgs'

import DateTimeCalendar from './components/DateTimeCalendar'
import DateTimeLabel from './components/DateTimeLabel'

import './DateTimePicker.scss'

const { Arrow, EmptyCalendar } = svgs

interface DateTimePickerProps {
  onChange: (val?: any) => void
  value?: any
  label?: string
  minDate?: DateTime
  maxDate?: DateTime
  showSeconds?: boolean
  isRequired?: boolean
  error?: any
  disablePortal?: boolean
  showCalendarIcon?: boolean
  showTime?: boolean
  disabled?: boolean
  canClear?: boolean
  showNow?: boolean
  enableCustomFormat?: boolean
  customFormat?: string
}

function DateTimePicker({
  onChange,
  value,
  label = EMPTY_STRING,
  minDate,
  maxDate,
  showSeconds,
  isRequired,
  error,
  disablePortal,
  showTime,
  showCalendarIcon = false,
  disabled = false,
  canClear = true,
  showNow,
  enableCustomFormat,
  customFormat
}: DateTimePickerProps) {
  const [isOpen, setOpen] = useState(false)
  const ref = useRef(null)

  const labelClasses = clsx({
    'picker-label': true,
    'picker-label-disabled': disabled,
    'picker-label-active': isOpen,
    'has-error': error,
    'picker-no-label': !label,
    'picker-label-show-calendar': showCalendarIcon
  })

  const dateTimePickerClasses = clsx({
    'datetime-picker': true,
    'datetime-picker-no-label': !label
  })

  return (
    <div
      ref={ref}
      className={dateTimePickerClasses}
    >
      <div
        className={labelClasses}
        onClick={() => setOpen((state) => !state)}
      >
        {label ? (
          <div className='picker-label-title'>
            {label}
            {isRequired ? <span className='required-star'>*</span> : null}
          </div>
        ) : null}
        {showCalendarIcon ? (
          <EmptyCalendar />
        ) : (
          <Arrow className={clsx({ rotate180: isOpen })} />
        )}
        <div className='picker-label-text'>
          <DateTimeLabel
            customFormat={customFormat}
            date={value}
            disabled={disabled}
            enableCustomFormat={enableCustomFormat}
            showSeconds={showSeconds}
            showTime={showTime}
          />
        </div>
        <span className='datetime-picker-error'>{error}</span>
      </div>
      <Popper
        anchorEl={ref.current}
        className='popper-wrapper'
        disablePortal={disablePortal}
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        open={isOpen}
        transition
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: 'center top' }}
          >
            <Paper className='menu-popper menu-popper-calendar'>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div className='date-time-wrapper'>
                  <DateTimeCalendar
                    canClear={canClear}
                    initValue={value}
                    maxDate={maxDate}
                    minDate={minDate}
                    showNow={showNow}
                    showSeconds={showSeconds}
                    showTime={showTime}
                    onSubmit={(val) => {
                      onChange(val)
                      setOpen(false)
                    }}
                  />
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default DateTimePicker
