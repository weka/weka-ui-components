import type { ChangeEvent, KeyboardEvent, RefObject } from 'react'

import { KEYBOARD_KEYS, SEARCH_PLACEHOLDER } from '#v2/utils/consts'

import { CloseIcon, SearchIcon } from '../../../icons'
import { SearchLoadingSpinner } from './SearchLoadingSpinner'

import styles from './select.module.scss'

const CLOSE_ICON_SIZE = 14
const SEARCH_ICON_SIZE = 16

const NAVIGATION_KEYS: ReadonlySet<string> = new Set([
  KEYBOARD_KEYS.ARROW_DOWN,
  KEYBOARD_KEYS.ARROW_UP,
  KEYBOARD_KEYS.ENTER
])

interface SelectSearchBoxProps {
  inputRef: RefObject<HTMLInputElement>
  query: string
  isLoading: boolean
  onQueryChange: (e: ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  /** Receives arrow and Enter presses so the menu keeps its option navigation while the search box has focus. */
  onNavigateKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
}

export function SelectSearchBox({
  inputRef,
  query,
  isLoading,
  onQueryChange,
  onClear,
  onNavigateKeyDown
}: Readonly<SelectSearchBoxProps>) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEYBOARD_KEYS.ESCAPE) {
      /*
       * First Escape clears a query; with nothing to clear it
       * must reach MUI so the menu closes.
       */
      if (query) {
        e.stopPropagation()
        onClear()
      }
      return
    }
    if (NAVIGATION_KEYS.has(e.key)) {
      onNavigateKeyDown(e)
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <SearchIcon
          extraClass={styles.searchIcon}
          height={SEARCH_ICON_SIZE}
          width={SEARCH_ICON_SIZE}
        />
        <input
          ref={inputRef}
          autoFocus
          className={styles.searchInput}
          onChange={onQueryChange}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          placeholder={SEARCH_PLACEHOLDER}
          type='text'
          value={query}
        />
        <SearchLoadingSpinner visible={isLoading} />
        {query ? (
          <button
            className={styles.searchClearButton}
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              onClear()
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
  )
}
