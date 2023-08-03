import React, { useState, useRef } from 'react'
import { DateTime } from 'luxon'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import clsx from 'clsx'
import DateTimeLabel from './components/DateTimeLabel'
import { Arrow, EmptyCalendar } from '../../svgs'
import DateTimeCalendar from './components/DateTimeCalendar'
import { EMPTY_STRING } from '../../consts'

import './DateTimePicker.scss'

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
}

function DateTimePicker(props: DateTimePickerProps) {
  const {
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
    showNow
  } = props
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
    <div className={dateTimePickerClasses} ref={ref}>
      <div className={labelClasses} onClick={() => setOpen((state) => !state)}>
        {label && (
          <div className='picker-label-title'>
            {label}
            {isRequired && <span className='required-star'>*</span>}
          </div>
        )}
        {showCalendarIcon ? (
          <EmptyCalendar />
        ) : (
          <Arrow className={clsx({ rotate180: isOpen })} />
        )}
        <div className='picker-label-text'>
          <DateTimeLabel
            date={value}
            showSeconds={showSeconds}
            showTime={showTime}
            disabled={disabled}
          />
        </div>
        <span className='datetime-picker-error'>{error}</span>
      </div>
      <Popper
        disablePortal={disablePortal}
        open={isOpen}
        anchorEl={ref.current}
        transition
        className='popper-wrapper'
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center top' }}>
            <Paper className='menu-popper menu-popper-calendar'>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div className='date-time-wrapper'>
                  <DateTimeCalendar
                    initValue={value}
                    minDate={minDate}
                    maxDate={maxDate}
                    onSubmit={(val) => {
                      onChange(val)
                      setOpen(false)
                    }}
                    showSeconds={showSeconds}
                    showTime={showTime}
                    canClear={canClear}
                    showNow={showNow}
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
