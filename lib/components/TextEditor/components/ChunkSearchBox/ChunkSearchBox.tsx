import type { Ref } from 'react'

import clsx from 'clsx'

import './chunkSearchBox.scss'

const OPTION_BTN_CLASS = 'option-btn'

export interface ChunkSearchBoxProps {
  searchTerm: string
  onSearchTermChange: (term: string) => void
  onNext: () => void
  onPrev: () => void
  onClose?: () => void
  isRegex: boolean
  onRegexChange: (checked: boolean) => void
  isCaseSensitive: boolean
  onCaseSensitiveChange: (checked: boolean) => void
  isWholeWord: boolean
  onWholeWordChange: (checked: boolean) => void
  isSearchInSelection?: boolean
  onSearchInSelectionChange?: (checked: boolean) => void
  disabled?: boolean
  currentMatch: number
  totalMatches: number
  exceeded?: boolean
  searchInputRef?: Ref<HTMLInputElement>
}

function ChunkSearchBox({
  searchTerm,
  onSearchTermChange,
  onNext,
  onPrev,
  onClose,
  isRegex,
  onRegexChange,
  isCaseSensitive,
  onCaseSensitiveChange,
  isWholeWord,
  onWholeWordChange,
  isSearchInSelection,
  onSearchInSelectionChange,
  disabled,
  currentMatch,
  totalMatches,
  exceeded = false,
  searchInputRef
}: Readonly<ChunkSearchBoxProps>) {
  const totalDisplay = exceeded ? '999+' : String(totalMatches)
  const counterText =
    totalMatches > 0 ? `${currentMatch} of ${totalDisplay}` : '0 of 0'

  return (
    <div className={clsx('text-editor-chunk-search-box', 'right')}>
      <div className='search-form'>
        <input
          ref={searchInputRef}
          aria-label='Search for'
          autoFocus
          className='search-field'
          id='chunk-search-field'
          maxLength={500}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder='Search for'
          spellCheck={false}
          value={searchTerm}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose?.()
            } else if (e.key === 'Enter') {
              if (e.shiftKey) {
                onPrev()
              } else {
                onNext()
              }
            } else if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
              e.preventDefault()
              e.currentTarget.select()
            } else {
              // no-op for other keys
            }
          }}
        />
        <span
          className={clsx('search-btn', 'prev')}
          onClick={disabled ? undefined : onPrev}
        >
          {'\u200b'}
        </span>
        <span
          className={clsx('search-btn', 'next')}
          onClick={disabled ? undefined : onNext}
        >
          {'\u200b'}
        </span>
      </div>
      <div className='search-options'>
        <span className='search-counter'>{counterText}</span>
        <span
          className={clsx(OPTION_BTN_CLASS, isRegex && 'checked')}
          onClick={() => onRegexChange(!isRegex)}
          title='RegExp Search'
        >
          .*
        </span>
        <span
          className={clsx(OPTION_BTN_CLASS, isCaseSensitive && 'checked')}
          onClick={() => onCaseSensitiveChange(!isCaseSensitive)}
          title='CaseSensitive Search'
        >
          Aa
        </span>
        <span
          className={clsx(OPTION_BTN_CLASS, isWholeWord && 'checked')}
          onClick={() => onWholeWordChange(!isWholeWord)}
          title='Whole Word Search'
        >
          \b
        </span>
        {onSearchInSelectionChange ? (
          <span
            className={clsx(OPTION_BTN_CLASS, isSearchInSelection && 'checked')}
            onClick={() => onSearchInSelectionChange(!isSearchInSelection)}
            title='Search In Selection'
          >
            S
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default ChunkSearchBox
