import type {
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode
} from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import { useCloseOnScroll } from '../../../hooks'
import { SearchIcon } from '../../../icons'
import { calculateVisibleChips } from '../../../utils/chipMeasurement'
import {
  DOM_EVENTS,
  EMPTY_STRING,
  EMPTY_STRING_ARRAY,
  TOOLTIP_PLACEMENTS
} from '../../../utils/consts'
import { Chip } from '../../Chip'
import { Tooltip } from '../../Tooltip'

import { DropdownContent } from './DropdownContent'
import { createKeyDownHandler } from './keyboardHandlers'
import { useRemoteSearch } from './useRemoteSearch'

import styles from './multiSelectAutocomplete.module.scss'

const MIN_COUNTER_THRESHOLD = 0
const DEFAULT_GAP_PX = 8
const DEFAULT_PLACEHOLDER = 'Type to search...'
const DEFAULT_MAX_VISIBLE_CHIPS = 10
const DEFAULT_MAX_LINES = 2
const DEFAULT_MIN_SEARCH_LENGTH = 2
const SEARCH_ICON_DIMENSION = 20
const TOOLTIP_ENTER_DELAY_MS = 200
const NO_SELECTION = -1
const FONT_FAMILY = "'IBMPlexSans', sans-serif"
const DEFAULT_CHIP_BG = 'var(--gray-200-800)'
const DEFAULT_CHIP_TEXT = 'var(--gray-900-100)'

const CHIP_MEASUREMENT = {
  CHIP_GAP: 6,
  CHIP_PADDING: 16,
  SEARCH_ICON_WIDTH: 20,
  MORE_INDICATOR_WIDTH: 50,
  INPUT_MIN_WIDTH_MANY: 80,
  INPUT_MIN_WIDTH_FEW: 150,
  TYPING_BUFFER_MANY: 0,
  TYPING_BUFFER_FEW: 20,
  MANY_CHIPS_THRESHOLD: 3,
  FONT_WEIGHT: '400'
} as const

const CHIP_DISPLAY_FONT_SIZE = '14px'
const CHIP_MAX_WIDTH = '320px'
const CHIP_MAX_WIDTH_PX = 320
const CHIP_ICON_WIDTH_PX = 14

export interface MultiSelectAutocompleteProps {
  label?: string
  placeholder?: string
  options?: string[]
  value: string[]
  onChange: (value: string[]) => void
  required?: boolean
  anyValue?: string
  chipBackgroundColor?: string
  chipTextColor?: string
  maxVisibleChips?: number
  maxLines?: number
  expandable?: boolean
  renderChipLabel?: (value: string) => string
  chipIcon?: ReactNode
  renderChipIcon?: (value: string) => ReactNode
  renderOptionIcon?: (value: string) => ReactNode
  onSearch?: (query: string) => Promise<string[]>
  defaultOptions?: string[]
  minSearchLength?: number
  isLoading?: boolean
  dataTestId?: string
}

export function MultiSelectAutocomplete({
  label,
  placeholder = DEFAULT_PLACEHOLDER,
  options = EMPTY_STRING_ARRAY as string[],
  value,
  onChange,
  required = false,
  anyValue,
  chipBackgroundColor = DEFAULT_CHIP_BG,
  chipTextColor = DEFAULT_CHIP_TEXT,
  maxVisibleChips = DEFAULT_MAX_VISIBLE_CHIPS,
  maxLines = DEFAULT_MAX_LINES,
  expandable = false,
  renderChipLabel,
  chipIcon,
  renderChipIcon,
  renderOptionIcon,
  onSearch,
  defaultOptions = EMPTY_STRING_ARRAY as string[],
  minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
  isLoading = false,
  dataTestId
}: Readonly<MultiSelectAutocompleteProps>) {
  const [inputValue, setInputValue] = useState(EMPTY_STRING)
  const [calculatedMaxChips, setCalculatedMaxChips] = useState(maxVisibleChips)
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasOpenedDropdown, setHasOpenedDropdown] = useState(false)
  const localFilteredOptions = useMemo(() => {
    if (onSearch) {
      return []
    }

    const sourceOptions = options.length > 0 ? options : defaultOptions
    const currentAnyValue = anyValue

    if (!inputValue.trim()) {
      const filtered = sourceOptions.filter((opt) => !value.includes(opt))
      const showAnyValue =
        filtered.length === 0 &&
        sourceOptions.length === 1 &&
        sourceOptions[0] === currentAnyValue

      return showAnyValue ? sourceOptions : filtered
    }
    return sourceOptions.filter(
      (opt) =>
        opt.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(opt)
    )
  }, [inputValue, value, options, defaultOptions, onSearch, anyValue])
  const [selectedIndex, setSelectedIndex] = useState(NO_SELECTION)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputWrapperRef = useRef<HTMLDivElement | null>(null)
  const anyValueRef = useRef(anyValue)

  useCloseOnScroll(
    showDropdown,
    () => {
      setShowDropdown(false)
      setSelectedIndex(NO_SELECTION)
    },
    dropdownRef,
    inputWrapperRef
  )

  useEffect(() => {
    anyValueRef.current = anyValue
  }, [anyValue])

  const { filteredOptions: remoteFilteredOptions, setFilteredOptions } =
    useRemoteSearch({
      onSearch,
      inputValue,
      minSearchLength,
      defaultOptions,
      showDropdown,
      hasOpenedDropdown,
      selectedValues: value
    })

  const filteredOptions = onSearch
    ? remoteFilteredOptions
    : localFilteredOptions

  useEffect(() => {
    const visibleValues = value.filter((entry) => entry !== anyValue)

    if (!inputWrapperRef.current || visibleValues.length === 0) {
      requestAnimationFrame(() => {
        setCalculatedMaxChips(maxVisibleChips)
      })
      return
    }

    const calculateMaxChips = () => {
      const wrapper = inputWrapperRef.current
      if (!wrapper) {
        return
      }

      const computedStyle = window.getComputedStyle(wrapper)
      const gap = parseFloat(computedStyle.gap) || DEFAULT_GAP_PX

      const wrapperWidth = wrapper.clientWidth
      const chipLabels = visibleValues.map((entry) =>
        renderChipLabel ? renderChipLabel(entry) : entry
      )

      const hasManyChips =
        chipLabels.length > CHIP_MEASUREMENT.MANY_CHIPS_THRESHOLD
      const reservedInputWidth = hasManyChips
        ? CHIP_MEASUREMENT.INPUT_MIN_WIDTH_MANY
        : CHIP_MEASUREMENT.INPUT_MIN_WIDTH_FEW
      const reservedTypingBuffer = hasManyChips
        ? CHIP_MEASUREMENT.TYPING_BUFFER_MANY
        : CHIP_MEASUREMENT.TYPING_BUFFER_FEW

      const result = calculateVisibleChips({
        maxLines,
        values: chipLabels,
        containerWidth: wrapperWidth,
        chipGap: CHIP_MEASUREMENT.CHIP_GAP,
        iconWidth: chipIcon || renderChipIcon ? CHIP_ICON_WIDTH_PX : 0,
        inputMinWidth: reservedInputWidth,
        searchIconWidth: CHIP_MEASUREMENT.SEARCH_ICON_WIDTH + gap,
        moreIndicatorWidth: CHIP_MEASUREMENT.MORE_INDICATOR_WIDTH,
        typingBuffer: reservedTypingBuffer,
        fontSize: CHIP_DISPLAY_FONT_SIZE,
        fontFamily: FONT_FAMILY,
        fontWeight: CHIP_MEASUREMENT.FONT_WEIGHT,
        maxChipWidth: CHIP_MAX_WIDTH_PX,
        hasCloseButton: true,
        chipPadding: CHIP_MEASUREMENT.CHIP_PADDING
      })

      requestAnimationFrame(() => {
        setCalculatedMaxChips(
          Math.max(1, Math.min(result.visibleCount, maxVisibleChips))
        )
      })
    }

    calculateMaxChips()
    window.addEventListener(DOM_EVENTS.RESIZE, calculateMaxChips)

    return () => {
      window.removeEventListener(DOM_EVENTS.RESIZE, calculateMaxChips)
    }
  }, [
    value,
    maxLines,
    maxVisibleChips,
    anyValue,
    renderChipLabel,
    chipIcon,
    renderChipIcon
  ])

  const updateDropdownPosition = useCallback(() => {
    if (showDropdown && inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [showDropdown])

  useEffect(() => {
    updateDropdownPosition()
  }, [showDropdown, value, updateDropdownPosition])

  useEffect(() => {
    if (!showDropdown || !inputWrapperRef.current) {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      updateDropdownPosition()
    })

    resizeObserver.observe(inputWrapperRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [showDropdown, updateDropdownPosition])

  useEffect(() => {
    if (!showDropdown) {
      return
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const isOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(target)
      const isOutsideInputWrapper =
        inputWrapperRef.current && !inputWrapperRef.current.contains(target)

      if (isOutsideDropdown && isOutsideInputWrapper) {
        setShowDropdown(false)
        setSelectedIndex(NO_SELECTION)
      }
    }

    document.addEventListener(DOM_EVENTS.MOUSEDOWN, handleClickOutside)
    return () =>
      document.removeEventListener(DOM_EVENTS.MOUSEDOWN, handleClickOutside)
  }, [showDropdown])

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      const shouldShowDropdown = onSearch
        ? true
        : newValue.length >= minSearchLength
      setShowDropdown(shouldShowDropdown)
      setSelectedIndex(NO_SELECTION)
    },
    [onSearch, minSearchLength]
  )

  const handleOptionClick = useCallback(
    (option: string) => {
      if (anyValue && option === anyValue) {
        onChange([anyValue])
      } else {
        const newValue = value.filter((entry) => entry !== anyValue)
        onChange([...newValue, option])
      }

      if (onSearch) {
        setFilteredOptions((prev) => prev.filter((opt) => opt !== option))
      }

      setInputValue(EMPTY_STRING)
      setSelectedIndex(NO_SELECTION)

      if (maxVisibleChips === 1) {
        setShowDropdown(false)
      } else {
        inputRef.current?.focus()
      }
    },
    [value, onChange, anyValue, maxVisibleChips, onSearch, setFilteredOptions]
  )

  const handleRemoveChip = useCallback(
    (valueToRemove: string) => {
      const newValue = value.filter((entry) => entry !== valueToRemove)
      if (newValue.length === 0 && anyValue) {
        onChange([anyValue])
      } else {
        onChange(newValue)
      }
      setInputValue(EMPTY_STRING)
    },
    [value, onChange, anyValue]
  )

  const handleRemoveChipRef = useRef(handleRemoveChip)
  const handleOptionClickRef = useRef(handleOptionClick)

  useEffect(() => {
    handleRemoveChipRef.current = handleRemoveChip
  }, [handleRemoveChip])

  useEffect(() => {
    handleOptionClickRef.current = handleOptionClick
  }, [handleOptionClick])

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      const handler = createKeyDownHandler(
        {
          inputValue,
          value,
          anyValue,
          showDropdown,
          filteredOptions,
          selectedIndex
        },
        {
          handleRemoveChip: (entry: string) =>
            handleRemoveChipRef.current(entry),
          handleOptionClick: (option: string) =>
            handleOptionClickRef.current(option),
          setSelectedIndex,
          setShowDropdown
        }
      )
      handler(e)
    },
    [inputValue, value, anyValue, showDropdown, filteredOptions, selectedIndex]
  )

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus()
    if (onSearch || inputValue.length >= minSearchLength) {
      setShowDropdown(true)
      setHasOpenedDropdown(true)
    }
  }, [onSearch, inputValue.length, minSearchLength])

  const handleInputFocus = useCallback(() => {
    if (onSearch || inputValue.length >= minSearchLength) {
      setShowDropdown(true)
      setHasOpenedDropdown(true)
    }
  }, [onSearch, inputValue.length, minSearchLength])

  const renderChips = () => {
    if (value.length === 1 && value[0] === anyValue) {
      return (
        <Chip
          key={anyValue}
          backgroundColor={chipBackgroundColor}
          textColor={chipTextColor}
        >
          {renderChipLabel ? renderChipLabel(anyValue) : anyValue}
        </Chip>
      )
    }

    const visibleValues = value.filter((entry) => entry !== anyValue)
    const displayedValues = expandable
      ? visibleValues
      : visibleValues.slice(0, calculatedMaxChips)
    const remainingCount = expandable
      ? 0
      : visibleValues.length - calculatedMaxChips
    const remainingValues = expandable
      ? []
      : visibleValues.slice(calculatedMaxChips)

    return (
      <>
        {displayedValues.map((val) => (
          <Chip
            key={val}
            backgroundColor={chipBackgroundColor}
            closable
            maxWidth={CHIP_MAX_WIDTH}
            onClose={() => handleRemoveChip(val)}
            textColor={chipTextColor}
          >
            {renderChipIcon ? renderChipIcon(val) : chipIcon}
            {renderChipLabel ? renderChipLabel(val) : val}
          </Chip>
        ))}
        {remainingCount > MIN_COUNTER_THRESHOLD && (
          <Tooltip
            enterDelay={TOOLTIP_ENTER_DELAY_MS}
            extraPopperClass={styles.tooltipPopper}
            placement={TOOLTIP_PLACEMENTS.TOP}
            data={
              <div className={styles.tooltipContent}>
                {remainingValues.map((val) => (
                  <div key={val}>
                    {renderChipLabel ? renderChipLabel(val) : val}
                  </div>
                ))}
              </div>
            }
          >
            <span
              className={styles.moreChipsIndicator}
              style={{
                backgroundColor: chipBackgroundColor,
                color: chipTextColor
              }}
            >
              +{remainingCount}
            </span>
          </Tooltip>
        )}
      </>
    )
  }

  const renderDropdown = () => {
    if (!showDropdown) {
      return null
    }

    const dropdownContent = (
      <div
        ref={dropdownRef}
        className={styles.dropdown}
        data-testid={dataTestId ? `${dataTestId}-dropdown` : undefined}
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width
        }}
      >
        <DropdownContent
          anyValue={anyValue}
          dataTestId={dataTestId}
          filteredOptions={filteredOptions}
          hasRemoteSearch={Boolean(onSearch)}
          inputValue={inputValue}
          isLoading={isLoading}
          minSearchLength={minSearchLength}
          onOptionClick={handleOptionClick}
          onOptionHover={setSelectedIndex}
          renderOptionIcon={renderOptionIcon}
          selectedIndex={selectedIndex}
        />
      </div>
    )

    return createPortal(dropdownContent, document.body)
  }

  return (
    <div
      ref={containerRef}
      className={styles.container}
      data-testid={dataTestId}
    >
      {label ? (
        <label className={styles.label}>
          {label} {required ? <span className={styles.required}>*</span> : null}
        </label>
      ) : null}
      <div
        ref={inputWrapperRef}
        onClick={handleContainerClick}
        className={clsx(styles.inputWrapper, {
          [styles.focused]: showDropdown,
          [styles.singleLine]: !expandable && maxLines === 1,
          [styles.twoLines]: !expandable && maxLines === 2,
          [styles.expandable]: expandable
        })}
      >
        <div className={styles.chipsContainer}>
          {renderChips()}
          <input
            ref={inputRef}
            className={styles.input}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : EMPTY_STRING}
            type='text'
            value={inputValue}
          />
        </div>
        {isLoading ? (
          <div className={styles.spinner} />
        ) : (
          <div className={styles.searchIconWrapper}>
            <SearchIcon
              extraClass={styles.searchIcon}
              height={SEARCH_ICON_DIMENSION}
              width={SEARCH_ICON_DIMENSION}
            />
          </div>
        )}
      </div>
      {renderDropdown()}
    </div>
  )
}
