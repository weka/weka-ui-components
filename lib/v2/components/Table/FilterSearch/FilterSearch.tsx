import type { ChangeEvent } from 'react'

import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING, SEARCH_PLACEHOLDER } from '#v2/utils/consts'

import { CloseIcon, SearchIcon } from '../../../icons'

import styles from './filterSearch.module.scss'

export interface FilterSearchProps {
  extraClass?: string
  placeholder?: string
  value?: string
  isLoading?: boolean
  onSearch?: (query: string) => void
  onClear?: () => void
  debounceMs?: number
  setShowOptionsList: (showList: boolean) => void
  setSelectedOptionIndex: (index: number) => void
}

const DEFAULT_DEBOUNCE_MS = 300
const MIN_CHARS_TO_SEARCH = 1
const NO_SELECTION_INDEX = -1
const SEARCH_ICON_SIZE = 18

export function FilterSearch({
  extraClass,
  placeholder = SEARCH_PLACEHOLDER,
  value = EMPTY_STRING,
  isLoading = false,
  onSearch,
  onClear,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  setShowOptionsList,
  setSelectedOptionIndex
}: Readonly<FilterSearchProps>) {
  const [query, setQuery] = useState(value)

  const inputRef = useRef<HTMLInputElement>(null)
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
        setShowOptionsList(true)
      }, debounceMs)
    },
    [cancelPendingSearch, debounceMs, onSearch, setShowOptionsList]
  )

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value
      setQuery(newQuery)
      setSelectedOptionIndex(NO_SELECTION_INDEX)
      if (newQuery.length > MIN_CHARS_TO_SEARCH) {
        handleSearch(newQuery)
      } else {
        cancelPendingSearch()
        setShowOptionsList(false)
        onSearch?.(EMPTY_STRING)
      }
    },
    [
      cancelPendingSearch,
      handleSearch,
      onSearch,
      setSelectedOptionIndex,
      setShowOptionsList
    ]
  )

  const handleClear = useCallback(() => {
    cancelPendingSearch()
    setQuery(EMPTY_STRING)
    setShowOptionsList(false)
    setSelectedOptionIndex(NO_SELECTION_INDEX)
    inputRef.current?.focus()
    onClear?.()
    onSearch?.(EMPTY_STRING)
  }, [
    cancelPendingSearch,
    onClear,
    onSearch,
    setSelectedOptionIndex,
    setShowOptionsList
  ])

  useEffect(() => {
    setQuery(value)
  }, [value])

  return (
    <div className={clsx(styles.searchContainer, extraClass)}>
      <div className={styles.inputWrapper}>
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
          data-testid='filter-search-input'
          onChange={handleInputChange}
          placeholder={placeholder}
          type='text'
          value={query}
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
    </div>
  )
}
