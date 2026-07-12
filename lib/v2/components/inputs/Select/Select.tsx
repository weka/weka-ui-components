import {
  type ChangeEvent,
  Fragment,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  FormControl,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent
} from '@mui/material'
import clsx from 'clsx'

import { useCloseOnScroll } from '#v2/hooks'
import {
  COMMA_SEPARATOR,
  EMPTY_STRING,
  KEYBOARD_KEYS,
  SEARCH_PLACEHOLDER
} from '#v2/utils/consts'
import { highlightText } from '#v2/utils/textUtils'

import { ChevronDownSmallIcon, CloseIcon, SearchIcon } from '../../../icons'
import { Chip } from '../../Chip'
import {
  applyAnyValueRules,
  getNextEnabledIndex,
  normalizeSelectValue,
  type SelectOptionValue
} from './selectUtils'
import { SplitMenuList } from './SplitMenuList'

import styles from './select.module.scss'

const DEFAULT_SEARCH_THRESHOLD = 8
const DEFAULT_SEARCH_DEBOUNCE_MS = 300
const DEFAULT_MIN_SEARCH_LENGTH = 2
const MENU_MAX_HEIGHT = 300
const SEARCH_FOCUS_DELAY_MS = 100
const NO_HIGHLIGHT = -1
const CHEVRON_ICON_SIZE = 16
const CLOSE_ICON_SIZE = 14
const SEARCH_ICON_SIZE = 16
const DEFAULT_PLACEHOLDER = 'Select...'
const DEFAULT_CHIP_TEXT_COLOR = 'var(--gray-900-100)'
const DEFAULT_CHIP_BACKGROUND_COLOR = 'var(--purple-100-900)'

export type { SelectOptionValue } from './selectUtils'

export interface SelectOption {
  value: SelectOptionValue
  label: string
  icon?: ReactNode
  chipBackgroundColor?: string
  chipTextColor?: string
  subLabel?: string
  disabled?: boolean
}

export interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  value?: SelectOptionValue | SelectOptionValue[]
  onChange(value: SelectOptionValue | SelectOptionValue[]): void
  disabled?: boolean
  multiple?: boolean
  required?: boolean
  renderChip?: (option: SelectOption, onRemove: () => void) => ReactNode
  renderOption?: (option: SelectOption) => ReactNode
  renderValue?: (option: SelectOption) => ReactNode
  anyValue?: SelectOptionValue
  maxVisibleChips?: number
  isLoading?: boolean
  onSearch?: (query: string) => void | Promise<void>
  searchDebounceMs?: number
  minSearchLength?: number
  searchThreshold?: number
  dataTestId?: string
}

export function Select({
  label,
  placeholder = DEFAULT_PLACEHOLDER,
  options,
  value: valueProp,
  onChange,
  disabled = false,
  multiple = false,
  required = false,
  renderChip,
  renderOption,
  renderValue,
  anyValue,
  maxVisibleChips,
  isLoading = false,
  onSearch,
  searchDebounceMs = DEFAULT_SEARCH_DEBOUNCE_MS,
  minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
  searchThreshold = DEFAULT_SEARCH_THRESHOLD,
  dataTestId
}: Readonly<SelectProps>) {
  const value = normalizeSelectValue(valueProp, multiple)
  const [searchQuery, setSearchQuery] = useState(EMPTY_STRING)
  const [isOpen, setIsOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(NO_HIGHLIGHT)
  const formControlRef = useRef<HTMLDivElement | null>(null)
  const selectFieldRef = useRef<HTMLDivElement | null>(null)
  const menuPaperRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuItemRefs = useRef<Map<number, HTMLLIElement>>(new Map())

  const hasAsyncSearch = !!onSearch
  const showSearch = options.length > searchThreshold || !!searchQuery

  const optionsWithSelected = useMemo(() => {
    const selectedValues = multiple
      ? (value as SelectOptionValue[])
      : [value as SelectOptionValue]
    const result = [...options]

    selectedValues
      .filter((v) => v !== undefined && v !== null && v !== EMPTY_STRING)
      .forEach((val) => {
        if (!result.some((opt) => opt.value === val)) {
          result.unshift({ value: val, label: String(val) })
        }
      })

    return result
  }, [options, value, multiple])

  const filteredOptions = useMemo(() => {
    const selectedValues = multiple
      ? (value as SelectOptionValue[])
      : [value as SelectOptionValue]
    const selectedSet = new Set(
      selectedValues.filter(
        (v) => v !== undefined && v !== null && v !== EMPTY_STRING
      )
    )

    let baseOptions = optionsWithSelected

    if (showSearch && searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      baseOptions = optionsWithSelected.filter((option) =>
        option.label.toLowerCase().includes(query)
      )
    }

    const missingSelectedOptions: SelectOption[] = []
    selectedSet.forEach((val) => {
      if (!baseOptions.find((opt) => opt.value === val)) {
        const fullOption = optionsWithSelected.find((opt) => opt.value === val)
        if (fullOption) {
          missingSelectedOptions.push(fullOption)
        } else {
          missingSelectedOptions.push({ value: val, label: String(val) })
        }
      }
    })

    return [...missingSelectedOptions, ...baseOptions]
  }, [optionsWithSelected, searchQuery, showSearch, value, multiple])

  useEffect(() => {
    if (isOpen && showSearch) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, SEARCH_FOCUS_DELAY_MS)
      })
    }
  }, [isOpen, showSearch])

  useEffect(() => {
    if (isOpen && hasAsyncSearch && onSearch) {
      void onSearch(EMPTY_STRING)
    }
  }, [isOpen, hasAsyncSearch, onSearch])

  useEffect(
    () => () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    },
    []
  )

  const debouncedSearch = useCallback(
    (query: string) => {
      if (!onSearch) {
        return
      }

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      const trimmedQuery = query.trim()

      if (trimmedQuery.length === 0 || trimmedQuery.length >= minSearchLength) {
        searchTimeoutRef.current = setTimeout(() => {
          void onSearch(trimmedQuery)
        }, searchDebounceMs)
      }
    },
    [onSearch, searchDebounceMs, minSearchLength]
  )

  const handleChange = (
    e: SelectChangeEvent<SelectOptionValue | SelectOptionValue[]>
  ) => {
    const incoming = e.target.value
    if (!multiple) {
      onChange(incoming)
      return
    }
    onChange(
      applyAnyValueRules(
        incoming as SelectOptionValue[],
        value as SelectOptionValue[],
        anyValue
      )
    )
  }

  const handleRemoveChip = (valueToRemove: SelectOptionValue) => {
    if (!multiple || !Array.isArray(value)) {
      return
    }
    const remaining = (value as SelectOptionValue[]).filter(
      (entry) => entry !== valueToRemove
    )
    onChange(
      applyAnyValueRules(remaining, value as SelectOptionValue[], anyValue)
    )
  }

  const getSelectedOptions = () => {
    if (!multiple || !Array.isArray(value)) {
      return []
    }
    return (value as SelectOptionValue[])
      .map((selectedValue) =>
        optionsWithSelected.find((option) => option.value === selectedValue)
      )
      .filter(Boolean) as SelectOption[]
  }

  const getDisplayValue = () => {
    if (multiple) {
      return value as SelectOptionValue[]
    }
    return value as SelectOptionValue
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setSearchQuery(newQuery)

    if (hasAsyncSearch) {
      debouncedSearch(newQuery)
    }
  }

  const handleSearchClear = () => {
    setSearchQuery(EMPTY_STRING)
    searchInputRef.current?.focus()
  }

  const handleMenuOpen = () => {
    const rect = (
      selectFieldRef.current ?? formControlRef.current
    )?.getBoundingClientRect()
    const spaceBelow = rect ? window.innerHeight - rect.bottom : Infinity
    const spaceAbove = rect ? rect.top : 0
    setOpenUpward(spaceBelow < MENU_MAX_HEIGHT && spaceAbove > spaceBelow)
    setIsOpen(true)
    setSearchQuery(EMPTY_STRING)
  }

  const handleMenuClose = useCallback(() => {
    setIsOpen(false)
    setOpenUpward(false)
    setSearchQuery(EMPTY_STRING)
    setHighlightedIndex(NO_HIGHLIGHT)
  }, [])

  useCloseOnScroll(isOpen, handleMenuClose, menuPaperRef, formControlRef)

  const scrollToHighlightedItem = (index: number) => {
    const element = menuItemRefs.current.get(index)
    if (element) {
      element.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }

  const commitHighlightedOption = () => {
    if (highlightedIndex < 0 || highlightedIndex >= filteredOptions.length) {
      return
    }
    const selectedOption = filteredOptions[highlightedIndex]
    if (selectedOption.disabled) {
      return
    }
    if (multiple) {
      const currentValue = value as SelectOptionValue[]
      const isAlreadySelected = currentValue.includes(selectedOption.value)
      const toggled = isAlreadySelected
        ? currentValue.filter((entry) => entry !== selectedOption.value)
        : [...currentValue, selectedOption.value]
      onChange(applyAnyValueRules(toggled, currentValue, anyValue))
    } else {
      onChange(selectedOption.value)
      setIsOpen(false)
    }
  }

  const moveHighlight = (step: number) => {
    setHighlightedIndex((prev) => {
      const nextIndex = getNextEnabledIndex(filteredOptions, prev, step)
      if (step < 0 && nextIndex === prev && showSearch) {
        searchInputRef.current?.focus()
        return NO_HIGHLIGHT
      }
      scrollToHighlightedItem(nextIndex)
      return nextIndex
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (filteredOptions.length === 0) {
      return
    }

    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
        e.preventDefault()
        e.stopPropagation()
        moveHighlight(1)
        break
      case KEYBOARD_KEYS.ARROW_UP:
        e.preventDefault()
        e.stopPropagation()
        moveHighlight(-1)
        break
      case KEYBOARD_KEYS.ENTER:
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          e.preventDefault()
          e.stopPropagation()
          commitHighlightedOption()
        }
        break
    }
  }

  const renderSingleValue = (selectedValue: SelectOptionValue): ReactNode => {
    if (
      selectedValue === undefined ||
      selectedValue === null ||
      selectedValue === EMPTY_STRING
    ) {
      return <span className={styles.placeholder}>{placeholder}</span>
    }
    const selectedOption = optionsWithSelected.find(
      (opt) => opt.value === selectedValue
    )
    if (renderValue && selectedOption) {
      return renderValue(selectedOption)
    }
    const displayText = selectedOption?.label || String(selectedValue)
    return (
      <span
        className={styles.selectedValue}
        title={displayText}
      >
        {displayText}
      </span>
    )
  }

  const renderMultipleValue = (
    selectedArray: SelectOptionValue[]
  ): ReactNode => {
    if (selectedArray.length === 0) {
      return <span className={styles.placeholder}>{placeholder}</span>
    }
    const selectedOpts = getSelectedOptions()
    const chips = selectedOpts
      .map((option) => {
        if (anyValue && option.value === anyValue) {
          return null
        }
        if (renderChip) {
          return (
            <Fragment key={option.value}>
              {renderChip(option, () => handleRemoveChip(option.value))}
            </Fragment>
          )
        }
        return (
          <Chip
            key={option.value}
            closable
            onClose={() => handleRemoveChip(option.value)}
            textColor={option.chipTextColor || DEFAULT_CHIP_TEXT_COLOR}
            backgroundColor={
              option.chipBackgroundColor || DEFAULT_CHIP_BACKGROUND_COLOR
            }
          >
            {option.icon}
            {option.label}
          </Chip>
        )
      })
      .filter(Boolean)

    if (chips.length === 0 && selectedOpts.length > 0) {
      return (
        <span>
          {selectedOpts.map((option) => option.label).join(COMMA_SEPARATOR)}
        </span>
      )
    }

    const hasOverflow = maxVisibleChips && chips.length > maxVisibleChips
    const visibleChips = hasOverflow ? chips.slice(0, maxVisibleChips) : chips
    const remainingCount = hasOverflow ? chips.length - maxVisibleChips : 0

    return (
      <div className={styles.chipsContainer}>
        {visibleChips}
        {remainingCount > 0 && (
          <span className={styles.moreChipsIndicator}>+{remainingCount}</span>
        )}
      </div>
    )
  }

  const renderMenuContent = (): ReactNode => {
    if (isLoading) {
      return (
        <MenuItem
          disabled
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className={styles.loadingContainer}>
            <span className={styles.loadingSpinner} />
            <span>Loading...</span>
          </div>
        </MenuItem>
      )
    }

    if (!filteredOptions || filteredOptions.length === 0) {
      return (
        <MenuItem disabled>
          {searchQuery ? 'No results found' : 'No options available'}
        </MenuItem>
      )
    }

    return filteredOptions.map((option, index) => (
      <MenuItem
        key={option.value}
        ref={(el) => {
          if (el) {
            menuItemRefs.current.set(index, el)
          } else {
            menuItemRefs.current.delete(index)
          }
        }}
        data-testid={`select-option-${option.value}`}
        disabled={option.disabled}
        value={option.value}
        className={clsx(styles.menuItem, {
          [styles.highlighted]: index === highlightedIndex
        })}
      >
        {renderOption ? (
          renderOption(option)
        ) : (
          <div className={styles.menuItemContent}>
            {option.icon ? (
              <span className={styles.menuItemIcon}>{option.icon}</span>
            ) : null}
            <span className={styles.menuItemText}>
              <span className={styles.menuItemLabel}>
                {highlightText(
                  option.label,
                  searchQuery,
                  'mark',
                  styles.highlight
                )}
              </span>
              {option.subLabel ? (
                <span className={styles.menuItemSubLabel}>
                  {option.subLabel}
                </span>
              ) : null}
            </span>
          </div>
        )}
      </MenuItem>
    ))
  }

  return (
    <FormControl
      ref={formControlRef}
      className={styles.formControl}
      disabled={disabled}
      fullWidth
    >
      {label ? (
        <label className={styles.label}>
          {label} {required ? <span className={styles.required}>*</span> : null}
        </label>
      ) : null}
      <MuiSelect
        ref={selectFieldRef}
        className={clsx(styles.select, multiple && styles.selectMultiple)}
        data-testid={dataTestId}
        displayEmpty
        multiple={multiple}
        native={false}
        onChange={handleChange}
        onClose={handleMenuClose}
        onOpen={handleMenuOpen}
        open={isOpen}
        value={getDisplayValue()}
        IconComponent={() => (
          <ChevronDownSmallIcon
            color='var(--gray-920-50)'
            height={CHEVRON_ICON_SIZE}
            width={CHEVRON_ICON_SIZE}
          />
        )}
        MenuProps={{
          PaperProps: {
            ref: menuPaperRef,
            className: clsx(styles.menuPaper, openUpward && styles.menuPaperUp),
            onKeyDown: handleKeyDown
          },
          MenuListProps: {
            component: SplitMenuList
          },
          autoFocus: false,
          disableAutoFocusItem: true,
          disableScrollLock: true,
          anchorOrigin: {
            vertical: openUpward ? 'top' : 'bottom',
            horizontal: 'left'
          },
          transformOrigin: {
            vertical: openUpward ? 'bottom' : 'top',
            horizontal: 'left'
          }
        }}
        inputProps={{
          style: { cursor: 'pointer' }
        }}
        renderValue={(selected) =>
          multiple
            ? renderMultipleValue(selected as SelectOptionValue[])
            : renderSingleValue(selected as SelectOptionValue)
        }
      >
        {showSearch ? (
          <MenuItem
            key='search-menu-item'
            className={styles.searchMenuItem}
            data-search-menu-item
            disabled
          >
            <div className={styles.searchContainer}>
              <div className={styles.searchInputWrapper}>
                <SearchIcon
                  extraClass={styles.searchIcon}
                  height={SEARCH_ICON_SIZE}
                  width={SEARCH_ICON_SIZE}
                />
                <input
                  ref={searchInputRef}
                  autoFocus
                  className={styles.searchInput}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={SEARCH_PLACEHOLDER}
                  type='text'
                  value={searchQuery}
                  onKeyDown={(e) => {
                    if (e.key === KEYBOARD_KEYS.ESCAPE) {
                      e.stopPropagation()
                      setSearchQuery(EMPTY_STRING)
                      return
                    }
                    if (
                      e.key === KEYBOARD_KEYS.ARROW_DOWN ||
                      e.key === KEYBOARD_KEYS.ARROW_UP ||
                      e.key === KEYBOARD_KEYS.ENTER
                    ) {
                      handleKeyDown(e)
                    }
                  }}
                />
                {searchQuery ? (
                  <button
                    className={styles.searchClearButton}
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSearchClear()
                    }}
                  >
                    <CloseIcon
                      height={CLOSE_ICON_SIZE}
                      width={CLOSE_ICON_SIZE}
                    />
                  </button>
                ) : null}
              </div>
            </div>
          </MenuItem>
        ) : null}
        {renderMenuContent()}
      </MuiSelect>
    </FormControl>
  )
}
