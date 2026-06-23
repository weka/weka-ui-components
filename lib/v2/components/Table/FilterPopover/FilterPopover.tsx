import type { FilterConfig, FilterOption, FilterValue } from '../filterUtils'
import type { NumRangeFilterType } from '../NumberRange'
import type { CustomFilters } from './filterRegistry'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { DateTime } from 'luxon'

import { useFilterKeyboardNavigation } from '#v2/hooks'
import { EMPTY_STRING, FILTER_TYPES, KEYBOARD_KEYS } from '#v2/utils/consts'

import { ChevronDownSmallIcon, FilterIcon } from '../../../icons'
import { Button } from '../../Button'
import { Checkbox } from '../../CheckBox'
import { DateTimePicker } from '../../DateTimePicker'
import { FilterOptionRow } from '../FilterOptionRow'
import { FilterSearch } from '../FilterSearch'
import { isFilterValueEmpty } from '../filterUtils'
import { NumberRange } from '../NumberRange'

import styles from './filterPopover.module.scss'

interface FilterPopoverProps {
  config: FilterConfig
  value: FilterValue
  onValueChange: (value: FilterValue) => void
  onClose: () => void
  anchorElement: HTMLElement | null
  columnName: string
  columnId: string
  customFilters?: CustomFilters
}

const MIN_SEARCH_THRESHOLD = 10
const CLICK_RESET_DELAY_MS = 100

const SELECT_OPTION_PLACEHOLDER = 'Select option...'
const ALL_OPTIONS_PLACEHOLDER = 'All options...'
const NO_MATCHES_FOUND = 'No matches found'
const SELECT_ALL_LABEL = 'Select All'
const CLEAR_SELECTION_LABEL = 'Clear selection'
const APPLY_LABEL = 'Apply'
const NUM_RANGE_INVALID_TOOLTIP = 'Max. cannot be smaller than Min.'

function FilterPopover({
  config,
  value,
  onValueChange,
  onClose,
  columnName,
  columnId,
  customFilters
}: Readonly<FilterPopoverProps>) {
  const customFilter = customFilters?.[config.type]

  const getInitialValue = useCallback((): FilterValue => {
    if (customFilter) {
      return (value as object) ?? (customFilter.getDefaultValue() as object)
    }
    if (config.type === FILTER_TYPES.MULTISELECT) {
      return (value as string[]) || []
    }
    if (config.type === FILTER_TYPES.DATETIME) {
      return (
        (value as { from?: string; to?: string }) || {
          from: undefined,
          to: undefined
        }
      )
    }
    if (config.type === FILTER_TYPES.NUM_RANGE) {
      return (value as NumRangeFilterType) || { min: null, max: null }
    }
    return (value as string) || EMPTY_STRING
  }, [value, config.type, customFilter])

  const [tempValue, setTempValue] = useState<FilterValue>(getInitialValue())
  const [showOptionsList, setShowOptionsList] = useState(false)
  const isClickingRef = useRef(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)
  const [filteredOptions, setFilteredOptions] = useState<FilterOption[]>(
    config.options || []
  )
  const [searchQuery, setSearchQuery] = useState(EMPTY_STRING)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1)
  const [applyDisabledTooltip, setApplyDisabledTooltip] = useState(EMPTY_STRING)

  const [seededOptions, setSeededOptions] = useState(config.options)
  if (seededOptions !== config.options) {
    setSeededOptions(config.options)
    setFilteredOptions(config.options || [])
  }

  const [editorRemountKey, setEditorRemountKey] = useState(0)
  const [seededValue, setSeededValue] = useState(value)
  if (seededValue !== value) {
    setSeededValue(value)
    setTempValue(getInitialValue())
    setEditorRemountKey((key) => key + 1)
  }
  const popoverRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      const queryStr = String(query || EMPTY_STRING)

      if (
        !config.options ||
        !Array.isArray(config.options) ||
        config.options.length === 0
      ) {
        setFilteredOptions([])
        return
      }

      if (!queryStr.trim()) {
        setFilteredOptions(config.options || [])
        return
      }

      const filtered = config.options.filter((option) => {
        const optionStr = String(option.label || EMPTY_STRING)
        return optionStr.toLowerCase().includes(queryStr.toLowerCase())
      })
      setFilteredOptions(filtered)
    },
    [config.options]
  )

  const handleApply = () => {
    const isEmpty = customFilter
      ? customFilter.isEmpty(tempValue)
      : isFilterValueEmpty(tempValue)
    onValueChange(isEmpty ? undefined : tempValue)
    onClose()
  }

  const toggleMultiselectOption = (optionValue: string) => {
    const selectedValues = tempValue as string[]
    const newSelected = selectedValues.includes(optionValue)
      ? selectedValues.filter((current) => current !== optionValue)
      : [...selectedValues, optionValue]
    setTempValue(newSelected)
  }

  const { handleGlobalKeyDown } = useFilterKeyboardNavigation({
    filteredOptions,
    selectedOptionIndex,
    setSelectedOptionIndex,
    setShowOptionsList,
    onClose,
    filterType: config.type,
    onApply: handleApply,
    onToggleOption: toggleMultiselectOption
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleGlobalKeyDown(e)
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        !isClickingRef.current &&
        showOptionsList &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setShowOptionsList(false)
        setDropdownPosition(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [handleGlobalKeyDown, showOptionsList])

  const renderDropdownFilter = () => {
    const selectChips = config.selectChips as Record<string, ReactNode>
    const hasCustomChips = selectChips && Object.keys(selectChips).length > 0

    if (hasCustomChips) {
      return (
        <div className={styles.customDropdownContainer}>
          <div
            ref={dropdownRef}
            className={styles.customDropdown}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              isClickingRef.current = true
              const newValue = !showOptionsList

              if (newValue && dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect()
                setDropdownPosition({
                  top: rect.bottom + window.scrollY,
                  left: rect.left + window.scrollX,
                  width: rect.width
                })
              } else {
                setDropdownPosition(null)
              }

              setShowOptionsList(newValue)
              setTimeout(() => {
                isClickingRef.current = false
              }, CLICK_RESET_DELAY_MS)
            }}
          >
            <div className={styles.selectedOption}>
              {tempValue && selectChips?.[tempValue as string] ? (
                selectChips[tempValue as string]
              ) : (
                <span className={styles.placeholder}>
                  {config.placeholder || SELECT_OPTION_PLACEHOLDER}
                </span>
              )}
            </div>
            <div className={styles.dropdownArrow}>
              <ChevronDownSmallIcon />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.dropdownContainer}>
        <select
          autoFocus
          className={styles.dropdown}
          value={tempValue as string}
          onChange={(e) => {
            setTempValue(e.target.value)
          }}
        >
          <option value={EMPTY_STRING}>
            {config.placeholder || ALL_OPTIONS_PLACEHOLDER}
          </option>
          {config.options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  const handleSelectAll = (shouldConvertToChecked: boolean) => {
    setTempValue(
      shouldConvertToChecked
        ? filteredOptions.map((option) => option.value)
        : []
    )
  }

  const renderMultiSelectFilter = () => {
    const selectedValues = tempValue as string[]
    const shouldShowSearch =
      (Array.isArray(config.options) &&
        config.options?.length >= MIN_SEARCH_THRESHOLD) ||
      config.startWithSearch

    const showOptionsImmediately = showOptionsList || !shouldShowSearch

    const getChipElement = (optionValue: string): ReactNode | null => {
      if (!config.selectChips || typeof config.selectChips !== 'object') {
        return null
      }
      if (Array.isArray(config.selectChips)) {
        return null
      }
      return config.selectChips[optionValue] ?? null
    }

    const renderFilterOption = (option: FilterOption, index: number) => {
      const chipElement = getChipElement(option.value)

      return (
        <FilterOptionRow
          key={option.value}
          chipElement={chipElement}
          dataOptionIndex={index}
          dataTestId={`filter-option-${option.value}`}
          isHovered={index === selectedOptionIndex}
          isSelected={selectedValues.includes(option.value)}
          label={option.label}
          onChange={() => toggleMultiselectOption(option.value)}
          searchQuery={searchQuery}
          shouldHighlightMatches={shouldShowSearch}
        />
      )
    }

    const getOptionsList = () => {
      if (showOptionsImmediately) {
        if (filteredOptions?.length > 0) {
          return (
            <div
              className={styles.optionsList}
              data-testid='multiselect-options-list'
            >
              <div>{filteredOptions?.map(renderFilterOption)}</div>
            </div>
          )
        }
        return (
          <div
            className={styles.noMatchesFound}
            data-testid='multiselect-no-matches'
          >
            {NO_MATCHES_FOUND}
          </div>
        )
      }
      return null
    }

    const isAllSelected = (): boolean => {
      if (!Array.isArray(tempValue) || filteredOptions.length === 0) {
        return false
      }
      return filteredOptions.every((option) => tempValue.includes(option.value))
    }

    const isSomeSelected = (): boolean => {
      if (!Array.isArray(tempValue) || filteredOptions.length === 0) {
        return false
      }
      return filteredOptions.some((option) => tempValue.includes(option.value))
    }

    return (
      <div
        className={styles.multiselectContainer}
        data-testid='multiselect-filter-container'
      >
        {shouldShowSearch ? (
          <FilterSearch
            onSearch={handleSearch}
            setSelectedOptionIndex={setSelectedOptionIndex}
            setShowOptionsList={setShowOptionsList}
          />
        ) : null}
        {showOptionsImmediately ? (
          <div
            className={styles.selectAll}
            data-testid='multiselect-select-all'
          >
            <Checkbox
              checked={isAllSelected()}
              onChange={handleSelectAll}
              partiallyChecked={isSomeSelected() && !isAllSelected()}
            />
            <span className={styles.selectAllTitle}>{SELECT_ALL_LABEL}</span>
          </div>
        ) : null}
        {getOptionsList()}
      </div>
    )
  }

  const renderNumRangeFilter = () => {
    const rangeValue = tempValue as NumRangeFilterType
    const isValidRange = ({ min, max }: NumRangeFilterType) => {
      const hasAtLeastOne = min !== null || max !== null
      const validOrder = min === null || max === null || max >= min
      return hasAtLeastOne && validOrder
    }
    return (
      <NumberRange
        initialValues={rangeValue}
        onChange={(filter: NumRangeFilterType) => {
          setTempValue(filter)
          setApplyDisabledTooltip(
            !isValidRange(filter) ? NUM_RANGE_INVALID_TOOLTIP : EMPTY_STRING
          )
        }}
      />
    )
  }

  const renderDateTimeFilter = () => {
    const dateValue = tempValue as { from?: string; to?: string }

    const parseDateTime = (isoString?: string): DateTime | undefined => {
      if (!isoString) {
        return undefined
      }
      try {
        const dt = DateTime.fromISO(isoString)
        return dt.isValid ? dt : undefined
      } catch {
        return undefined
      }
    }

    return (
      <div className={styles.datetimeContainer}>
        <div className={styles.dateField}>
          <label className={styles.dateFieldLabel}>From:</label>
          <DateTimePicker
            enableCustomFormat
            maxDate={parseDateTime(dateValue.to) || DateTime.now()}
            showSeconds={false}
            value={parseDateTime(dateValue.from)}
            onChange={(date?: DateTime) => {
              setTempValue({
                ...dateValue,
                from: date?.isValid ? date.toISO() ?? undefined : undefined
              })
            }}
          />
        </div>
        <div className={styles.dateField}>
          <label className={styles.dateFieldLabel}>To:</label>
          <DateTimePicker
            enableCustomFormat
            maxDate={DateTime.now()}
            minDate={parseDateTime(dateValue.from)?.startOf('day')}
            showSeconds={false}
            value={parseDateTime(dateValue.to)}
            onChange={(date?: DateTime) => {
              setTempValue({
                ...dateValue,
                to: date?.isValid ? date.toISO() ?? undefined : undefined
              })
            }}
          />
        </div>
      </div>
    )
  }

  const renderCustomFilter = () => {
    if (!customFilter) {
      return null
    }
    return customFilter.render({
      value: tempValue,
      onChange: (next) => {
        setTempValue(next as FilterValue)
        setApplyDisabledTooltip(customFilter.validate?.(next) ?? EMPTY_STRING)
      },
      modeLabels: config.modeLabels
    })
  }

  const renderTextFilter = () => (
    <input
      autoFocus
      className={styles.textFilterInput}
      data-testid='text-filter-input'
      onChange={(e) => setTempValue(e.target.value)}
      placeholder={config.placeholder || 'Filter...'}
      type='text'
      value={(tempValue as string) ?? EMPTY_STRING}
      onKeyDown={(e) => {
        if (e.key === KEYBOARD_KEYS.ENTER) {
          handleApply()
        }
      }}
    />
  )

  const renderFilterContent = () => {
    switch (config.type) {
      case FILTER_TYPES.TEXT:
        return renderTextFilter()
      case FILTER_TYPES.DROPDOWN:
        return renderDropdownFilter()
      case FILTER_TYPES.MULTISELECT:
        return renderMultiSelectFilter()
      case FILTER_TYPES.DATETIME:
        return renderDateTimeFilter()
      case FILTER_TYPES.NUM_RANGE:
        return renderNumRangeFilter()
      default:
        return renderCustomFilter()
    }
  }

  const renderDropdownOptionsPortal = () => {
    if (!showOptionsList || !dropdownPosition) {
      return null
    }

    const selectChips = config.selectChips as Record<string, ReactNode>

    return createPortal(
      <div
        className={styles.customDropdownOptions}
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width
        }}
      >
        <div
          className={styles.customOption}
          onClick={() => {
            setTempValue(EMPTY_STRING)
            setShowOptionsList(false)
            setDropdownPosition(null)
          }}
        >
          <span className={styles.placeholder}>{CLEAR_SELECTION_LABEL}</span>
        </div>
        {config.options?.map((option) => (
          <div
            key={option.value}
            className={clsx(
              styles.customOption,
              tempValue === option.value && styles.selected
            )}
            onClick={() => {
              setTempValue(option.value)
              setShowOptionsList(false)
              setDropdownPosition(null)
            }}
          >
            {selectChips?.[option.value] || option.label}
          </div>
        ))}
      </div>,
      document.body
    )
  }

  const shouldHideApplyButton = (): boolean => {
    if (config.type !== FILTER_TYPES.AUTOCOMPLETE) {
      return false
    }

    const isNameField =
      columnId === 'name' || columnName.toLowerCase().includes('name')
    if (!isNameField) {
      return false
    }

    return Boolean(value && typeof value !== 'object' && String(value).trim())
  }

  return (
    <>
      {renderDropdownOptionsPortal()}
      <div
        ref={popoverRef}
        className={styles.popover}
        data-testid='filter-popover'
      >
        {config.title ? (
          <div className={styles.popoverHeader}>
            <h4>{config.title}</h4>
          </div>
        ) : null}
        <div
          key={editorRemountKey}
          className={styles.popoverContent}
        >
          {renderFilterContent()}
        </div>
        {!shouldHideApplyButton() && (
          <div className={styles.popoverActions}>
            <div className={styles.applyWrapper}>
              <Button
                Icon={FilterIcon}
                dataTestId='filter-apply-button'
                disabled={!!applyDisabledTooltip}
                onClick={handleApply}
                title={applyDisabledTooltip}
              >
                {APPLY_LABEL}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export { FilterPopover }
