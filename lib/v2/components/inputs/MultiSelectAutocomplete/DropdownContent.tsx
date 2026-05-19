import type { ReactNode } from 'react'

import clsx from 'clsx'

import { highlightText } from '#v2/utils/textUtils'

import styles from './multiSelectAutocomplete.module.scss'

interface DropdownContentProps {
  isLoading: boolean
  filteredOptions: string[]
  selectedIndex: number
  inputValue: string
  anyValue?: string
  minSearchLength: number
  hasRemoteSearch: boolean
  renderOptionIcon?: (value: string) => ReactNode
  onOptionClick: (option: string) => void
  onOptionHover: (index: number) => void
  dataTestId?: string
}

function getNoResultsMessage(
  inputValue: string,
  minSearchLength: number,
  hasRemoteSearch: boolean
): string {
  if (hasRemoteSearch && inputValue.length < minSearchLength) {
    return `Type at least ${minSearchLength} characters to search...`
  }

  if (inputValue) {
    return 'No matches found'
  }

  return 'No more options available'
}

export function DropdownContent({
  isLoading,
  filteredOptions,
  selectedIndex,
  inputValue,
  anyValue,
  minSearchLength,
  hasRemoteSearch,
  renderOptionIcon,
  onOptionClick,
  onOptionHover,
  dataTestId
}: Readonly<DropdownContentProps>) {
  if (isLoading) {
    return (
      <div className={styles.loadingResults}>
        <div className={styles.spinner} />
        Searching...
      </div>
    )
  }

  if (filteredOptions.length === 0) {
    const message = getNoResultsMessage(
      inputValue,
      minSearchLength,
      hasRemoteSearch
    )
    return <div className={styles.noResults}>{message}</div>
  }

  return (
    <>
      {filteredOptions.map((option, index) => (
        <div
          key={option}
          data-option-index={index}
          data-testid={dataTestId ? `${dataTestId}-option-${index}` : undefined}
          onClick={() => onOptionClick(option)}
          onMouseEnter={() => onOptionHover(index)}
          className={clsx(
            styles.option,
            index === selectedIndex && styles.selected
          )}
        >
          {renderOptionIcon ? renderOptionIcon(option) : null}
          <span>
            {option === anyValue
              ? anyValue
              : highlightText(
                  option,
                  inputValue,
                  'mark',
                  styles.optionHighlight
                )}
          </span>
        </div>
      ))}
    </>
  )
}
