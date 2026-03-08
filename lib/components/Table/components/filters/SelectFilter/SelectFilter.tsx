import React, { useEffect, useMemo, useState } from 'react'

import { EMPTY_STRING } from 'consts'
import Utils from 'utils'

import Select from '../../../../inputs/Select'
import type { SelectFilterMode, SelectFilterValue } from '../../../tableUtils'
import { FILTER_MODES } from '../../../tableUtils'
import type { ExtendedFilterProps } from '../../../types'
import FilterWrapper from '../../FilterWrapper'

import './selectFilter.scss'

export interface SelectFilterOptions {
  fixedOptions?: string[]
  /**
   * Enable advanced filtering with Include/Exclude modes.
   * Set to false for server-side paginated tables.
   * @default true
   */
  advancedFiltering?: boolean
}

const FILTER_MODE_OPTIONS = [
  { value: FILTER_MODES.INCLUDE, label: 'Include' },
  { value: FILTER_MODES.EXCLUDE, label: 'Exclude' }
]

const getValueFromFilterValue = (
  fv: SelectFilterValue | string | undefined
): string => {
  if (fv === undefined) {
    return EMPTY_STRING
  }
  if (typeof fv === 'string') {
    return fv
  }
  return fv.value ?? EMPTY_STRING
}

const getModeFromFilterValue = (
  fv: SelectFilterValue | string | undefined
): SelectFilterMode => {
  if (fv === undefined || typeof fv === 'string') {
    return FILTER_MODES.INCLUDE
  }
  return fv.mode ?? FILTER_MODES.INCLUDE
}

function SelectFilter<Data, Value>({
  table,
  column,
  filterOptions
}: ExtendedFilterProps<Data, Value, SelectFilterOptions>) {
  const { fixedOptions, advancedFiltering = true } = filterOptions
  const filterValue = column.getFilterValue() as
    | SelectFilterValue
    | string
    | undefined

  const initialValue = getValueFromFilterValue(filterValue)
  const initialMode = advancedFiltering
    ? getModeFromFilterValue(filterValue)
    : FILTER_MODES.INCLUDE

  const [value, setValue] = useState<string>(initialValue)
  const [mode, setMode] = useState<SelectFilterMode>(initialMode)

  useEffect(() => {
    setValue(getValueFromFilterValue(filterValue))
    if (advancedFiltering) {
      setMode(getModeFromFilterValue(filterValue))
    }
  }, [filterValue, advancedFiltering])

  const visibleItems = table.getRowModel().rows.length

  const options = useMemo(() => {
    if (visibleItems === 0) {
      return []
    }

    const optionsValues: string[] = fixedOptions
      ? [...new Set<string>(fixedOptions)]
      : [...column.getFacetedUniqueValues().keys()]

    return Utils.insensitiveSort(optionsValues).map(Utils.formatStringOption)
  }, [column, fixedOptions, visibleItems])

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
  }

  const handleModeChange = (newMode: SelectFilterMode) => {
    setMode(newMode)
  }

  const valueToSubmit = advancedFiltering
    ? ({ value, mode } as SelectFilterValue)
    : value

  const shouldDisableBtn = () => !value

  return (
    <FilterWrapper
      column={column}
      shouldDisableBtn={shouldDisableBtn}
      value={valueToSubmit as Value}
    >
      <div className='table-select-filter'>
        <Select
          autoFocus
          onChange={handleValueChange}
          options={options}
          value={value}
        />
        {advancedFiltering ? (
          <Select
            onChange={handleModeChange}
            options={FILTER_MODE_OPTIONS}
            value={mode}
          />
        ) : null}
      </div>
    </FilterWrapper>
  )
}

export default SelectFilter
