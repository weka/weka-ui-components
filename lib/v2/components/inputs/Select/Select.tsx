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
import { SplitMenuList } from './SplitMenuList'

import styles from './select.module.scss'

const DEFAULT_SEARCH_THRESHOLD = 8
const DEFAULT_SEARCH_DEBOUNCE_MS = 300
const DEFAULT_MIN_SEARCH_LENGTH = 2
const SEARCH_FOCUS_DELAY_MS = 100
const NO_HIGHLIGHT = -1
const CHEVRON_ICON_SIZE = 16
const CLOSE_ICON_SIZE = 14
const SEARCH_ICON_SIZE = 16
const DEFAULT_PLACEHOLDER = 'Select...'
const DEFAULT_CHIP_TEXT_COLOR = 'var(--gray-900-100)'
const DEFAULT_CHIP_BACKGROUND_COLOR = 'var(--purple-100-900)'

function applyAnyValueRules(
  nextValues: string[],
  prevValues: string[],
  anyValue: string | undefined
): string[] {
  if (!anyValue) {
    return nextValues
  }

  if (nextValues.length === 0) {
    return [anyValue]
  }

  const prevHadAny = prevValues.includes(anyValue)
  const nextHasAny = nextValues.includes(anyValue)

  if (nextHasAny && !prevHadAny) {
    return [anyValue]
  }

  if (nextHasAny && nextValues.length > 1) {
    return nextValues.filter((entry) => entry !== anyValue)
  }

  return nextValues
}

export interface SelectOption {
  value: string
  label: string
  icon?: ReactNode
  chipBackgroundColor?: string
  chipTextColor?: string
}

export interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  disabled?: boolean
  multiple?: boolean
  required?: boolean
  renderChip?: (option: SelectOption, onRemove: () => void) => ReactNode
  renderOption?: (option: SelectOption) => ReactNode
  anyValue?: string
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
  value,
  onChange,
  disabled = false,
  multiple = false,
  required = false,
  renderChip,
  renderOption,
  anyValue,
  maxVisibleChips,
  isLoading = false,
  onSearch,
  searchDebounceMs = DEFAULT_SEARCH_DEBOUNCE_MS,
  minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
  searchThreshold = DEFAULT_SEARCH_THRESHOLD,
  dataTestId
}: Readonly<SelectProps>) {
  const [searchQuery, setSearchQuery] = useState(EMPTY_STRING)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(NO_HIGHLIGHT)
  const formControlRef = useRef<HTMLDivElement | null>(null)
  const menuPaperRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuItemRefs = useRef<Map<number, HTMLLIElement>>(new Map())

  const hasAsyncSearch = !!onSearch
  const showSearch = options.length > searchThreshold || !!searchQuery

  const optionsWithSelected = useMemo(() => {
    const selectedValues = multiple ? (value as string[]) : [value as string]
    const result = [...options]

    selectedValues.filter(Boolean).forEach((val) => {
      if (!result.some((opt) => opt.value === val)) {
        result.unshift({ value: val, label: val })
      }
    })

    return result
  }, [options, value, multiple])

  const filteredOptions = useMemo(() => {
    const selectedValues = multiple ? (value as string[]) : [value as string]
    const selectedSet = new Set(selectedValues.filter(Boolean))

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
          missingSelectedOptions.push({ value: val, label: val })
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

  const handleChange = (e: SelectChangeEvent<string | string[]>) => {
    const incoming = e.target.value
    if (!multiple) {
      onChange(incoming)
      return
    }
    onChange(
      applyAnyValueRules(incoming as string[], value as string[], anyValue)
    )
  }

  const handleRemoveChip = (valueToRemove: string) => {
    if (!multiple || !Array.isArray(value)) {
      return
    }
    const remaining = value.filter((entry) => entry !== valueToRemove)
    onChange(applyAnyValueRules(remaining, value, anyValue))
  }

  const getSelectedOptions = () => {
    if (!multiple || !Array.isArray(value)) {
      return []
    }
    return value
      .map((selectedValue) =>
        optionsWithSelected.find((option) => option.value === selectedValue)
      )
      .filter(Boolean) as SelectOption[]
  }

  const getDisplayValue = () => {
    if (multiple) {
      return value as string[]
    }
    return value as string
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
    setIsOpen(true)
    setSearchQuery(EMPTY_STRING)
  }

  const handleMenuClose = useCallback(() => {
    setIsOpen(false)
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

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (filteredOptions.length === 0) {
      return
    }

    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
        e.preventDefault()
        e.stopPropagation()
        setHighlightedIndex((prev) => {
          const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : prev
          scrollToHighlightedItem(nextIndex)
          return nextIndex
        })
        break
      case KEYBOARD_KEYS.ARROW_UP:
        e.preventDefault()
        e.stopPropagation()
        setHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : NO_HIGHLIGHT
          if (nextIndex === NO_HIGHLIGHT && showSearch) {
            searchInputRef.current?.focus()
          } else {
            scrollToHighlightedItem(nextIndex)
          }
          return nextIndex
        })
        break
      case KEYBOARD_KEYS.ENTER:
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          e.preventDefault()
          e.stopPropagation()
          const selectedOption = filteredOptions[highlightedIndex]
          if (multiple) {
            const currentValue = value as string[]
            const isAlreadySelected = currentValue.includes(
              selectedOption.value
            )
            const toggled = isAlreadySelected
              ? currentValue.filter((entry) => entry !== selectedOption.value)
              : [...currentValue, selectedOption.value]
            onChange(applyAnyValueRules(toggled, currentValue, anyValue))
          } else {
            onChange(selectedOption.value)
            setIsOpen(false)
          }
        }
        break
    }
  }

  const renderSingleValue = (selectedValue: string): ReactNode => {
    if (!selectedValue) {
      return <span className={styles.placeholder}>{placeholder}</span>
    }
    const selectedOption = optionsWithSelected.find(
      (opt) => opt.value === selectedValue
    )
    const displayText = selectedOption?.label || selectedValue
    return (
      <span
        className={styles.selectedValue}
        title={displayText}
      >
        {displayText}
      </span>
    )
  }

  const renderMultipleValue = (selectedArray: string[]): ReactNode => {
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
            <span>
              {highlightText(
                option.label,
                searchQuery,
                'mark',
                styles.highlight
              )}
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
            className: styles.menuPaper,
            onKeyDown: handleKeyDown
          },
          MenuListProps: {
            component: SplitMenuList
          },
          autoFocus: false,
          disableAutoFocusItem: true,
          disableScrollLock: true,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left'
          }
        }}
        inputProps={{
          style: { cursor: 'pointer' }
        }}
        renderValue={(selected) =>
          multiple
            ? renderMultipleValue(selected as string[])
            : renderSingleValue(selected as string)
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
