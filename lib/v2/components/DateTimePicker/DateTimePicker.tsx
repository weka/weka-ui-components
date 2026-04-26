import { useCallback, useState } from 'react'
import { ClickAwayListener, Grow, Paper, Popper } from '@mui/material'
import clsx from 'clsx'
import type { DateTime } from 'luxon'

import { DateTimeIcon } from '../../icons'

import { DateTimeCalendar } from './components/DateTimeCalendar'
import { DateTimeLabel } from './components/DateTimeLabel'

import styles from './dateTimePicker.module.scss'

export interface DateTimePickerProps {
  onChange: (val?: DateTime) => void
  value?: DateTime
  minDate?: DateTime
  maxDate?: DateTime
  showSeconds?: boolean
  disablePortal?: boolean
  showTime?: boolean
  disabled?: boolean
  canClear?: boolean
  showNow?: boolean
  enableCustomFormat?: boolean
  customFormat?: string
}

export function DateTimePicker({
  onChange,
  value,
  minDate,
  maxDate,
  showSeconds,
  disablePortal,
  showTime,
  disabled = false,
  canClear = true,
  showNow,
  enableCustomFormat,
  customFormat
}: Readonly<DateTimePickerProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const handleRef = useCallback((node: HTMLDivElement | null) => {
    setAnchorEl(node)
  }, [])

  return (
    <div
      ref={handleRef}
      className={styles.datetimePicker}
    >
      <div
        className={styles.pickerLabel}
        onClick={() => setIsOpen((state) => !state)}
      >
        <DateTimeIcon />
        <DateTimeLabel
          customFormat={customFormat}
          date={value}
          disabled={disabled}
          enableCustomFormat={enableCustomFormat}
          showSeconds={showSeconds}
          showTime={showTime}
        />
      </div>
      <Popper
        anchorEl={anchorEl}
        className={styles.popperWrapper}
        disablePortal={disablePortal}
        open={isOpen}
        placement='top'
        transition
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            className={styles.growTransition}
          >
            <Paper
              className={clsx(styles.menuPopper, styles.menuPopperCalendar)}
            >
              <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <div>
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
                      setIsOpen(false)
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
