import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { ExtendedFilterProps } from '../../../types'
import { EMPTY_STRING } from 'consts'
import FilterWrapper from '../../FilterWrapper'
import { Select } from '../../../../inputs'
import { TextFilterValue, TextFilterMode, validateRegexPattern, FILTER_MODES } from '../../../tableUtils'

import './textFilter.scss'

export interface TextFilterOptions {
  shouldDisableBtn?: (val: TextFilterValue | string) => boolean
  disabledBtnTooltip?: string
  /**
   * Enable advanced filtering with Include/Exclude/Regex modes.
   * Set to false for server-side paginated tables.
   * @default true
   */
  advancedFiltering?: boolean
}

const FILTER_MODE_OPTIONS = [
  { value: FILTER_MODES.INCLUDE, label: 'Include' },
  { value: FILTER_MODES.EXCLUDE, label: 'Exclude' },
  { value: FILTER_MODES.REGEX, label: 'Regular Expression' }
]

function TextFilter<Data, Value>({
  column,
  filterOptions
}: ExtendedFilterProps<Data, Value, TextFilterOptions>) {
  const { advancedFiltering = true } = filterOptions

  const filterValue = column.getFilterValue() as TextFilterValue | string | undefined

  const initialPattern = advancedFiltering
    ? (filterValue as TextFilterValue | undefined)?.pattern ?? EMPTY_STRING
    : (typeof filterValue === 'string' ? filterValue : EMPTY_STRING)
  
  const initialMode = advancedFiltering
    ? (filterValue as TextFilterValue | undefined)?.mode ?? FILTER_MODES.INCLUDE
    : FILTER_MODES.INCLUDE

  const [pattern, setPattern] = useState<string>(initialPattern)
  const [mode, setMode] = useState<TextFilterMode>(initialMode)
  const [error, setError] = useState<string>(EMPTY_STRING)

  useEffect(() => {
    if (advancedFiltering) {
      const value = filterValue as TextFilterValue | undefined
      setPattern(value?.pattern ?? EMPTY_STRING)
      setMode(value?.mode ?? FILTER_MODES.INCLUDE)
    } else {
      setPattern(typeof filterValue === 'string' ? filterValue : EMPTY_STRING)
    }
  }, [filterValue, advancedFiltering])

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPattern = e.target.value
    setPattern(newPattern)

    if (advancedFiltering && mode === FILTER_MODES.REGEX && newPattern) {
      const regexError = validateRegexPattern(newPattern)
      setError(regexError || EMPTY_STRING)
    } else {
      setError(EMPTY_STRING)
    }
  }

  const handleModeChange = (newMode: TextFilterMode) => {
    setMode(newMode)

    if (newMode === FILTER_MODES.REGEX && pattern) {
      const regexError = validateRegexPattern(pattern)
      setError(regexError || EMPTY_STRING)
    } else {
      setError(EMPTY_STRING)
    }
  }

  const valueToSubmit = advancedFiltering
    ? { pattern, mode } as TextFilterValue
    : pattern

  const shouldDisableBtn = (val: TextFilterValue | string) => {
    if (error) {
      return true
    }
    const patternValue = typeof val === 'string' ? val : val.pattern
    if (!patternValue) {
      return true
    }
    return filterOptions.shouldDisableBtn?.(val) ?? false
  }

  const disabledBtnTooltip = error || filterOptions.disabledBtnTooltip

  return (
    <FilterWrapper
      column={column}
      value={valueToSubmit as Value}
      shouldDisableBtn={shouldDisableBtn}
      disabledBtnTooltip={disabledBtnTooltip}
    >
      <div className='table-text-filter-wrapper'>
      <input
        autoFocus
          className={clsx('table-text-filter', { 'has-error': !!error })}
          value={pattern}
          onChange={handlePatternChange}
        type='text'
      />
        {error && <span className='table-text-filter-error'>{error}</span>}
        {advancedFiltering && (
          <Select
            options={FILTER_MODE_OPTIONS}
            value={mode}
            onChange={handleModeChange}
          />
        )}
      </div>
    </FilterWrapper>
  )
}

export default TextFilter
