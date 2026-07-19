import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { DateTime } from 'luxon'

import { useCloseOnScroll } from '#v2/hooks'
import { DOM_EVENTS, EMPTY_STRING } from '#v2/utils/consts'

import { ARROW_DIRECTIONS, ArrowIcon, FilterIcon } from '../../icons'
import { Button, BUTTON_VARIANTS } from '../Button'
import { DateTimePicker } from '../DateTimePicker'

import styles from './timeRangeSelector.module.scss'

export interface TimeRangeOption {
  label: string
  value: string
}

export interface CustomTimeRange {
  from: DateTime
  to: DateTime
}

export interface TimeRangeSelectorProps {
  selectedRange: string | CustomTimeRange
  onRangeChange: (range: string | CustomTimeRange) => void
}

const MAIN_DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm'
const DROPDOWN_OFFSET_PX = 4
const ARROW_ICON_SIZE = 16

const DATETIME_PICKER_SELECTORS = [
  '.datetime-picker',
  '.datetime-picker-popup',
  '.picker-label',
  '[data-picker-popup]',
  '.calendar-popup',
  '.date-picker-overlay',
  '.react-datepicker',
  '.react-datepicker__tab-loop',
  '.react-datepicker-popper',
  '.react-datepicker__header',
  '.react-datepicker__month',
  '.react-datepicker__day',
  '.react-datepicker__time-container',
  '.react-datepicker__input-time-container',
  '.MuiPickersPopper-root',
  '.MuiDateCalendar-root',
  '.MuiPickersLayout-root',
  '.MuiDialog-root',
  '[role="dialog"]',
  '[data-testid*="picker"]',
  '[class*="picker"]',
  '[class*="calendar"]',
  '[class*="datepicker"]'
]

const QUICK_OPTIONS: TimeRangeOption[] = [
  { label: 'Last Hour', value: '1h' },
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last Month', value: '30d' }
]

const LEGACY_RANGE_ALIASES: Record<string, string> = {
  '1d': '24h'
}

const toValidDate = (date?: DateTime) => (date?.isValid ? date : undefined)

function isInsideDatePicker(target: Element): boolean {
  return DATETIME_PICKER_SELECTORS.some((selector) =>
    Boolean(target.closest(selector))
  )
}

function getNormalizedRangeValue(
  selectedRange: string | CustomTimeRange
): string {
  if (typeof selectedRange === 'object') {
    return EMPTY_STRING
  }
  return LEGACY_RANGE_ALIASES[selectedRange] ?? selectedRange
}

function getRangeKey(selectedRange: string | CustomTimeRange): string {
  if (typeof selectedRange === 'object') {
    return `${selectedRange.from.toMillis()}-${selectedRange.to.toMillis()}`
  }
  return selectedRange
}

function getDisplayText(
  selectedRange: string | CustomTimeRange,
  normalizedRangeValue: string
): string {
  if (typeof selectedRange === 'object') {
    return `${selectedRange.from.toFormat(
      MAIN_DATE_TIME_FORMAT
    )} - ${selectedRange.to.toFormat(MAIN_DATE_TIME_FORMAT)}`
  }

  const quickOption = QUICK_OPTIONS.find(
    (option) => option.value === normalizedRangeValue
  )
  return quickOption?.label || 'Select Time Range'
}

export function TimeRangeSelector({
  selectedRange,
  onRangeChange
}: Readonly<TimeRangeSelectorProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const [customRange, setCustomRange] = useState<{
    from?: DateTime
    to?: DateTime
  }>(() => {
    if (typeof selectedRange === 'object') {
      return {
        from: selectedRange.from,
        to: selectedRange.to
      }
    }
    return {}
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number
    left: number
  } | null>(null)

  const isCurrentlyCustom = typeof selectedRange === 'object'
  const normalizedRangeValue = getNormalizedRangeValue(selectedRange)

  const selectedRangeKey = getRangeKey(selectedRange)
  const [lastSelectedRangeKey, setLastSelectedRangeKey] =
    useState(selectedRangeKey)
  if (selectedRangeKey !== lastSelectedRangeKey) {
    setLastSelectedRangeKey(selectedRangeKey)
    if (typeof selectedRange === 'object') {
      setCustomRange({
        from: selectedRange.from,
        to: selectedRange.to
      })
    } else {
      setCustomRange({})
    }
  }

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + DROPDOWN_OFFSET_PX,
        left: rect.left
      })
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element | null

      if (buttonRef.current && buttonRef.current.contains(target as Node)) {
        return
      }

      if (dropdownRef.current && dropdownRef.current.contains(target as Node)) {
        return
      }

      if (target && isInsideDatePicker(target)) {
        return
      }

      setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener(DOM_EVENTS.MOUSEDOWN, handleClickOutside)
    }

    return () =>
      document.removeEventListener(DOM_EVENTS.MOUSEDOWN, handleClickOutside)
  }, [isOpen])

  useCloseOnScroll(isOpen, () => setIsOpen(false), dropdownRef, buttonRef)

  const handleQuickOptionSelect = (value: string) => {
    onRangeChange(value)
    setCustomRange({})
    setIsOpen(false)
  }

  const handleApplyCustomRange = () => {
    if (customRange.from && customRange.to) {
      onRangeChange({
        from: customRange.from,
        to: customRange.to
      })
      setIsOpen(false)
    }
  }

  const isApplyEnabled = customRange.from && customRange.to

  return (
    <div
      ref={containerRef}
      className={styles.container}
    >
      <button
        ref={buttonRef}
        className={styles.selector}
        data-testid='time-range-selector'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.selectorText}>
          {getDisplayText(selectedRange, normalizedRangeValue)}
        </span>
        <ArrowIcon
          direction={isOpen ? ARROW_DIRECTIONS.DOWN : ARROW_DIRECTIONS.UP}
          extraClass={styles.dropdownArrow}
          size={ARROW_ICON_SIZE}
        />
      </button>
      {isOpen && dropdownPosition
        ? createPortal(
            <div
              ref={dropdownRef}
              className={styles.dropdown}
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`
              }}
            >
              <div className={styles.optionsList}>
                {QUICK_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    data-testid={`time-range-option-${option.value}`}
                    onClick={() => handleQuickOptionSelect(option.value)}
                    className={clsx(styles.option, {
                      [styles.selected]:
                        !isCurrentlyCustom &&
                        normalizedRangeValue === option.value
                    })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className={styles.divider} />
              <div className={styles.customRangeContainer}>
                <div className={styles.dateFields}>
                  <div>
                    <label className={styles.inputLabel}>From:</label>
                    <DateTimePicker
                      enableCustomFormat
                      fullWidth
                      maxDate={customRange.to || DateTime.now()}
                      showSeconds={false}
                      value={customRange.from}
                      onChange={(date?: DateTime) => {
                        setCustomRange({
                          ...customRange,
                          from: toValidDate(date)
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label className={styles.inputLabel}>To:</label>
                    <DateTimePicker
                      enableCustomFormat
                      fullWidth
                      maxDate={DateTime.now()}
                      minDate={customRange.from}
                      showSeconds={false}
                      value={customRange.to}
                      onChange={(date?: DateTime) => {
                        setCustomRange({
                          ...customRange,
                          to: toValidDate(date)
                        })
                      }}
                    />
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button
                    Icon={FilterIcon}
                    dataTestId='apply-time-range-button'
                    disabled={!isApplyEnabled}
                    onClick={handleApplyCustomRange}
                    variant={BUTTON_VARIANTS.PRIMARY}
                    title={
                      isApplyEnabled
                        ? EMPTY_STRING
                        : 'Please fill both From and To'
                    }
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  )
}
