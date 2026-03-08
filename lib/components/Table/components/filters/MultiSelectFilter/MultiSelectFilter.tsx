import React, { useEffect, useMemo, useState } from 'react'

import svgs from 'svgs'
import Utils from 'utils'

import { Select } from '../../../../inputs'
import type {
  MultiSelectFilterValue,
  SelectFilterMode
} from '../../../tableUtils'
import { FILTER_MODES } from '../../../tableUtils'
import type { ExtendedFilterProps } from '../../../types'
import FilterWrapper from '../../FilterWrapper'

import './multiSelectFilter.scss'

const { Close } = svgs

export interface MultiSelectFilterOptions {
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

const getValuesFromFilterValue = (
  fv: MultiSelectFilterValue | string[] | string | undefined
): string[] => {
  if (fv === undefined) {
    return []
  }
  if (Array.isArray(fv)) {
    return fv
  }
  if (typeof fv === 'string') {
    return [fv]
  }
  return fv.values ?? []
}

const getModeFromFilterValue = (
  fv: MultiSelectFilterValue | string[] | string | undefined
): SelectFilterMode => {
  if (fv === undefined || Array.isArray(fv) || typeof fv === 'string') {
    return FILTER_MODES.INCLUDE
  }
  return fv.mode ?? FILTER_MODES.INCLUDE
}

function MultiSelectFilter<Data, Value>({
  table,
  column,
  filterOptions
}: ExtendedFilterProps<Data, Value, MultiSelectFilterOptions>) {
  const filterValue = column.getFilterValue() as
    | MultiSelectFilterValue
    | string[]
    | string
    | undefined
  const { fixedOptions, advancedFiltering = true } = filterOptions

  const [values, setValues] = useState<string[]>(
    getValuesFromFilterValue(filterValue)
  )
  const [mode, setMode] = useState<SelectFilterMode>(
    advancedFiltering
      ? getModeFromFilterValue(filterValue)
      : FILTER_MODES.INCLUDE
  )

  const visibleItems = table.getRowModel().rows.length

  const options = useMemo(() => {
    if (visibleItems === 0) {
      return []
    }

    const optionsSet = new Set<string>()

    if (fixedOptions) {
      fixedOptions.forEach((option: string) => {
        if (!values.includes(option)) {
          optionsSet.add(option)
        }
      })
    } else {
      ;[...column.getFacetedUniqueValues().keys()].flatMap(
        (rowValue: string | string[] | undefined) => {
          if (Utils.isEmpty(rowValue)) {
            return
          }

          if (Array.isArray(rowValue)) {
            rowValue.forEach((val) => {
              if (!values.includes(val)) {
                optionsSet.add(val)
              }
            })
          } else if (!values.includes(rowValue)) {
            optionsSet.add(rowValue)
          }
        }
      )
    }

    return Utils.insensitiveSort([...optionsSet.values()]).map(
      Utils.formatStringOption
    )
  }, [column, fixedOptions, values, visibleItems])

  useEffect(() => {
    setValues(getValuesFromFilterValue(filterValue))
    if (advancedFiltering) {
      setMode(getModeFromFilterValue(filterValue))
    }
  }, [JSON.stringify(filterValue), advancedFiltering])

  const onSelectOne = (optionSelected: string) => {
    setValues([...values, optionSelected].sort())
  }

  const onUnselectOne = (optionUnselected: string) => {
    const filterSelect = values.filter((option) => option !== optionUnselected)
    setValues(filterSelect)
  }

  const handleModeChange = (newMode: SelectFilterMode) => {
    setMode(newMode)
  }

  const getSelectedOption = (selectOption: string) => (
    <div
      key={selectOption}
      className='selected-option'
    >
      <Close onClick={() => onUnselectOne(selectOption)} />
      <span className='dropdown-lines-1'>{selectOption}</span>
    </div>
  )

  const valueToSubmit = advancedFiltering
    ? ({ values, mode } as MultiSelectFilterValue)
    : values

  const shouldDisableBtn = () => values.length === 0

  return (
    <FilterWrapper
      column={column}
      shouldDisableBtn={shouldDisableBtn}
      value={valueToSubmit as Value}
    >
      <div className='table-multi-select-filter'>
        <Select
          autoFocus
          onChange={onSelectOne}
          options={options}
          sortOptions
          value={null}
        />
        <div className='selected-options-wrapper'>
          {values.map(getSelectedOption)}
        </div>
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

export default MultiSelectFilter
