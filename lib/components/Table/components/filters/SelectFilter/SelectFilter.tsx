import React, { useMemo, useState, useEffect } from 'react'
import Select from '../../../../inputs/Select'
import Utils from 'utils'
import { EMPTY_STRING } from 'consts'
import FilterWrapper from '../../FilterWrapper'
import { ExtendedFilterProps } from '../../../types'
import { SelectFilterValue, SelectFilterMode, FILTER_MODES } from '../../../tableUtils'

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

function SelectFilter<Data, Value>({
  table,
  column,
  filterOptions
}: ExtendedFilterProps<Data, Value, SelectFilterOptions>) {
  const { fixedOptions, advancedFiltering = true } = filterOptions
  const filterValue = column.getFilterValue() as SelectFilterValue | string | undefined

  const initialValue = advancedFiltering
    ? (filterValue as SelectFilterValue | undefined)?.value ?? EMPTY_STRING
    : (typeof filterValue === 'string' ? filterValue : EMPTY_STRING)

  const initialMode = advancedFiltering
    ? (filterValue as SelectFilterValue | undefined)?.mode ?? FILTER_MODES.INCLUDE
    : FILTER_MODES.INCLUDE

  const [value, setValue] = useState<string>(initialValue)
  const [mode, setMode] = useState<SelectFilterMode>(initialMode)

  useEffect(() => {
    if (advancedFiltering) {
      const fv = filterValue as SelectFilterValue | undefined
      setValue(fv?.value ?? EMPTY_STRING)
      setMode(fv?.mode ?? FILTER_MODES.INCLUDE)
    } else {
      setValue(typeof filterValue === 'string' ? filterValue : EMPTY_STRING)
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
    ? { value, mode } as SelectFilterValue
    : value

  const shouldDisableBtn = () => !value

  return (
    <FilterWrapper column={column} value={valueToSubmit as Value} shouldDisableBtn={shouldDisableBtn}>
      <div className='table-select-filter'>
        <Select options={options} onChange={handleValueChange} value={value} autoFocus />
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

export default SelectFilter
