import { type KeyboardEvent, type MouseEvent, useRef, useState } from 'react'

import { SearchIcon } from '../../icons'
import {
  EMPTY_STRING,
  KEYBOARD_KEYS,
  SEARCH_PLACEHOLDER
} from '../../utils/consts'

import styles from './expandableSearch.module.scss'

const SEARCH_ICON_SIZE = 20

const TITLES = {
  SEARCH: 'Search',
  CLEAR_SEARCH: 'Clear search',
  ADD_TO_FILTERS: 'Add to filters',
  CLOSE_SEARCH: 'Close search'
} as const

const TEST_ID_SUFFIXES = {
  OPEN: '-open',
  SUBMIT: '-submit',
  INPUT: '-input',
  CLEAR: '-clear'
} as const

export interface ExpandableSearchProps {
  onSearch: (value: string) => void
  onClear: () => void
  placeholder?: string
  showSubmitButton?: boolean
  onSubmit?: (value: string) => void
  dataTestId?: string
}

export function ExpandableSearch({
  onSearch,
  onClear,
  placeholder = SEARCH_PLACEHOLDER,
  showSubmitButton = false,
  onSubmit,
  dataTestId
}: Readonly<ExpandableSearchProps>) {
  const [showExpanded, setShowExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState(EMPTY_STRING)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const handleSearchIconClick = () => {
    setShowExpanded(true)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearch(value)
  }

  const handleSearchClose = () => {
    if (!searchValue) {
      setShowExpanded(false)
    }
  }

  const handleSearchClear = () => {
    setSearchValue(EMPTY_STRING)
    setShowExpanded(false)
    onClear()
  }

  const handleSubmit = () => {
    if (onSubmit && searchValue) {
      onSubmit(searchValue)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEYBOARD_KEYS.ENTER) {
      handleSubmit()
      return
    }
    if (e.key === KEYBOARD_KEYS.ESCAPE) {
      handleSearchClear()
    }
  }

  const handleSubmitButtonMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (showSubmitButton && searchValue) {
      handleSubmit()
    } else {
      handleSearchClear()
    }
  }

  const handleClearButtonMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleSearchClear()
  }

  return (
    <div
      ref={searchContainerRef}
      className={styles.searchContainer}
      data-testid={dataTestId}
    >
      {showExpanded ? (
        <div className={styles.searchExpanded}>
          <button
            className={styles.searchSubmitButton}
            data-testid={dataTestId?.concat(TEST_ID_SUFFIXES.SUBMIT)}
            onMouseDown={handleSubmitButtonMouseDown}
            type='button'
            title={
              showSubmitButton && searchValue
                ? TITLES.ADD_TO_FILTERS
                : TITLES.CLOSE_SEARCH
            }
          >
            <SearchIcon
              height={SEARCH_ICON_SIZE}
              width={SEARCH_ICON_SIZE}
            />
          </button>
          <input
            autoFocus
            className={styles.searchInput}
            data-testid={dataTestId?.concat(TEST_ID_SUFFIXES.INPUT)}
            onBlur={handleSearchClose}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            type='text'
            value={searchValue}
          />
          {searchValue ? (
            <button
              className={styles.clearButton}
              data-testid={dataTestId?.concat(TEST_ID_SUFFIXES.CLEAR)}
              onMouseDown={handleClearButtonMouseDown}
              title={TITLES.CLEAR_SEARCH}
              type='button'
            >
              ×
            </button>
          ) : null}
        </div>
      ) : (
        <button
          className={styles.searchIconButton}
          data-testid={dataTestId?.concat(TEST_ID_SUFFIXES.OPEN)}
          onClick={handleSearchIconClick}
          title={TITLES.SEARCH}
          type='button'
        >
          <SearchIcon
            height={SEARCH_ICON_SIZE}
            width={SEARCH_ICON_SIZE}
          />
        </button>
      )}
    </div>
  )
}
