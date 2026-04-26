import type { ChangeEvent, KeyboardEvent, ReactElement, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import { CloseIcon, SearchIcon } from '../../icons'
import {
  EMPTY_ARRAY,
  EMPTY_STRING,
  KEYBOARD_KEYS,
  SEARCH_PLACEHOLDER
} from '../../utils/consts'
import { highlightText } from '../../utils/textUtils'
import { Tooltip } from '../Tooltip'

import styles from './searchAutocomplete.module.scss'

const DROPDOWN_PORTAL_Z_INDEX = 10010
const DEFAULT_DEBOUNCE_MS = 300
const DEFAULT_MAX_RESULTS = 50
const SEARCH_ICON_SIZE = 24
const OPTION_ICON_SIZE = 16

function getEffectiveQuery(query: string, showAllOnFocus: boolean): string {
  if (showAllOnFocus && !query.trim()) {
    return EMPTY_STRING
  }
  return query
}

export interface SearchOption {
  id: string
  label: string
  sublabel?: string
  metadata?: Record<string, unknown>
}

export interface SearchAutocompleteProps {
  extraClass?: string
  placeholder?: string
  value?: string
  options?: readonly SearchOption[]
  isLoading?: boolean
  error?: string | null
  onSearch?: (query: string) => void
  onSelect?: (option: SearchOption) => void
  onClear?: () => void
  children?: (option: SearchOption, query: string) => ReactNode
  highlightMatches?: boolean
  debounceMs?: number
  maxResults?: number
  noResultsMessage?: string
  showDropdownHeader?: boolean
  dropdownHeaderContent?: ReactNode
  usePortal?: boolean
  showAllOnFocus?: boolean
  dropdownClassName?: string
}

export function SearchAutocomplete({
  extraClass,
  placeholder = SEARCH_PLACEHOLDER,
  value = EMPTY_STRING,
  options = EMPTY_ARRAY,
  isLoading = false,
  error = null,
  onSearch,
  onSelect,
  onClear,
  children,
  highlightMatches = false,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  maxResults = DEFAULT_MAX_RESULTS,
  noResultsMessage = 'No results found',
  showDropdownHeader = false,
  dropdownHeaderContent,
  usePortal = false,
  showAllOnFocus = false,
  dropdownClassName
}: Readonly<SearchAutocompleteProps>) {
  const [query, setQuery] = useState(value)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0
  })
  const [isFocused, setIsFocused] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelPendingSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }
  }, [])

  const handleSearch = useCallback(
    (searchQuery: string) => {
      cancelPendingSearch()
      searchTimeoutRef.current = setTimeout(() => {
        onSearch?.(searchQuery)
      }, debounceMs)
    },
    [cancelPendingSearch, onSearch, debounceMs]
  )

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newQuery = String(e.target.value || EMPTY_STRING)
      setQuery(newQuery)
      setSelectedIndex(-1)

      if (newQuery.trim()) {
        setShowDropdown(true)
        handleSearch(newQuery)
      } else {
        cancelPendingSearch()
        setShowDropdown(false)
        onSearch?.(EMPTY_STRING)
      }
    },
    [cancelPendingSearch, handleSearch, onSearch]
  )

  const handleOptionClick = useCallback(
    (option: SearchOption) => {
      cancelPendingSearch()
      setQuery(option.label)
      setShowDropdown(false)
      setSelectedIndex(-1)
      onSelect?.(option)
      onSearch?.(option.label)
      inputRef.current?.focus()
    },
    [cancelPendingSearch, onSelect, onSearch]
  )

  const handleClear = useCallback(() => {
    cancelPendingSearch()
    setQuery(EMPTY_STRING)
    setShowDropdown(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
    onClear?.()
    onSearch?.(EMPTY_STRING)
  }, [cancelPendingSearch, onClear, onSearch])

  const getHighlightedText = useCallback(
    (text: string, searchQuery: string): ReactElement => {
      const textStr = String(text || EMPTY_STRING)
      const queryStr = String(searchQuery || EMPTY_STRING)

      if (!highlightMatches || !queryStr.trim()) {
        return <>{textStr}</>
      }

      return <>{highlightText(textStr, queryStr, 'strong', styles.highlight)}</>
    },
    [highlightMatches]
  )

  const scrollToOption = useCallback((index: number) => {
    setTimeout(() => {
      document
        .querySelector(`[data-option-index="${index}"]`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, 0)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown || options.length === 0) {
        return
      }

      switch (e.key) {
        case KEYBOARD_KEYS.ARROW_DOWN:
          e.preventDefault()
          setSelectedIndex((prev) => {
            const newIndex = prev < options.length - 1 ? prev + 1 : 0
            scrollToOption(newIndex)
            return newIndex
          })
          break
        case KEYBOARD_KEYS.ARROW_UP:
          e.preventDefault()
          setSelectedIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : options.length - 1
            scrollToOption(newIndex)
            return newIndex
          })
          break
        case KEYBOARD_KEYS.ENTER:
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < options.length) {
            handleOptionClick(options[selectedIndex])
          }
          break
        case KEYBOARD_KEYS.ESCAPE:
          setShowDropdown(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    },
    [showDropdown, options, selectedIndex, handleOptionClick, scrollToOption]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    if (usePortal && showDropdown && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [usePortal, showDropdown])

  const displayOptions: readonly SearchOption[] =
    options.length > 0 ? options.slice(0, maxResults) : []

  const effectiveQuery = getEffectiveQuery(query, showAllOnFocus)

  const getDropdownStyle = () => {
    if (!usePortal) {
      return undefined
    }
    return {
      position: 'absolute' as const,
      top: dropdownPosition.top,
      left: dropdownPosition.left,
      width: dropdownPosition.width,
      zIndex: DROPDOWN_PORTAL_Z_INDEX
    }
  }

  const renderOptionContent = (option: SearchOption): ReactElement => {
    if (children) {
      return <>{children(option, effectiveQuery)}</>
    }
    return (
      <div className={styles.defaultOption}>
        <SearchIcon
          extraClass={styles.optionSearchIcon}
          height={OPTION_ICON_SIZE}
          width={OPTION_ICON_SIZE}
        />
        <div className={styles.optionContent}>
          <div className={styles.optionLabel}>
            <Tooltip
              data={option.label}
              ellipsis
            >
              {getHighlightedText(option.label, effectiveQuery)}
            </Tooltip>
          </div>
          {option.sublabel ? (
            <div className={styles.optionSublabel}>
              <Tooltip
                data={option.sublabel}
                ellipsis
              >
                {option.sublabel}
              </Tooltip>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  const renderDropdownOptions = (): ReactElement => (
    <>
      {displayOptions.length > 0 &&
        displayOptions.map((option, index) => (
          <div
            key={option.id}
            data-option-index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            className={clsx(
              styles.option,
              index === selectedIndex && styles.selected
            )}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleOptionClick(option)
            }}
          >
            {renderOptionContent(option)}
          </div>
        ))}
      {displayOptions.length === 0 && query.trim() && (
        <div className={styles.noResults}>{noResultsMessage}</div>
      )}
    </>
  )

  const renderDropdownBody = () => {
    if (error) {
      return <div className={styles.errorMessage}>{error}</div>
    }
    return (
      <>
        {showDropdownHeader && dropdownHeaderContent ? (
          <div className={styles.dropdownHeader}>{dropdownHeaderContent}</div>
        ) : null}
        {renderDropdownOptions()}
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
        data-portal-autocomplete='true'
        style={getDropdownStyle()}
        className={clsx(
          styles.dropdown,
          usePortal && isFocused && styles.dropdownFocused,
          dropdownClassName
        )}
      >
        {renderDropdownBody()}
      </div>
    )

    if (usePortal) {
      return createPortal(dropdownContent, document.body)
    }
    return dropdownContent
  }

  return (
    <div
      ref={containerRef}
      className={clsx(styles.searchContainer, extraClass)}
    >
      <div
        className={clsx(
          styles.inputWrapper,
          showDropdown && styles.dropdownOpen
        )}
      >
        <div className={styles.searchIcon}>
          <SearchIcon
            height={SEARCH_ICON_SIZE}
            width={SEARCH_ICON_SIZE}
          />
        </div>
        <input
          ref={inputRef}
          autoFocus
          className={styles.searchInput}
          onBlur={() => setIsFocused(false)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          type='text'
          value={query}
          onClick={() => {
            if (
              showAllOnFocus &&
              options &&
              options.length > 0 &&
              !query.trim()
            ) {
              setShowDropdown(true)
            }
          }}
          onFocus={() => {
            setIsFocused(true)
          }}
        />
        {query && !isLoading ? (
          <button
            aria-label='Clear search'
            className={styles.clearButton}
            onClick={handleClear}
            type='button'
          >
            <CloseIcon />
          </button>
        ) : null}
        {isLoading ? <div className={styles.loadingSpinner} /> : null}
      </div>
      {renderDropdown()}
    </div>
  )
}
