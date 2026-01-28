import React, { useState, useEffect, useMemo } from 'react'
import Utils from 'utils'
import svgs from 'svgs'
import { ExtendedFilterProps } from '../../../types'
import FilterWrapper from '../../FilterWrapper'
import { Select } from '../../../../inputs'
import { MultiSelectFilterValue, SelectFilterMode, FILTER_MODES } from '../../../tableUtils'

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

function MultiSelectFilter<Data, Value>({
  table,
  column,
  filterOptions
}: ExtendedFilterProps<Data, Value, MultiSelectFilterOptions>) {
  const filterValue = column.getFilterValue() as MultiSelectFilterValue | string[] | undefined
  const { fixedOptions, advancedFiltering = true } = filterOptions

  const getInitialValues = (): string[] => {
    if (advancedFiltering) {
      return (filterValue as MultiSelectFilterValue | undefined)?.values ?? []
    }
    if (filterValue === undefined) {
      return []
    }
    if (Array.isArray(filterValue)) {
      return filterValue as string[]
    }
    if (typeof filterValue === 'string') {
      return [filterValue]
    }
    return []
  }

  const getInitialMode = (): SelectFilterMode => {
    if (advancedFiltering) {
      return (filterValue as MultiSelectFilterValue | undefined)?.mode ?? FILTER_MODES.INCLUDE
    }
    return FILTER_MODES.INCLUDE
  }

  const [values, setValues] = useState<string[]>(getInitialValues())
  const [mode, setMode] = useState<SelectFilterMode>(getInitialMode())

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
          if (Utils.isEmpty(rowValue) || !rowValue) {
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
    if (advancedFiltering) {
      const fv = filterValue as MultiSelectFilterValue | undefined
      setValues(fv?.values ?? [])
      setMode(fv?.mode ?? FILTER_MODES.INCLUDE)
    } else {
      const formatValue =
        filterValue === undefined
          ? []
          : Array.isArray(filterValue)
          ? filterValue
          : typeof filterValue === 'string'
          ? [filterValue]
          : []
      setValues(formatValue)
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
    <div key={selectOption} className='selected-option'>
      <Close onClick={() => onUnselectOne(selectOption)} />
      <span className='dropdown-lines-1'>{selectOption}</span>
    </div>
  )

  const valueToSubmit = advancedFiltering
    ? { values, mode } as MultiSelectFilterValue
    : values

  const shouldDisableBtn = () => values.length === 0

  return (
    <FilterWrapper value={valueToSubmit as Value} column={column} shouldDisableBtn={shouldDisableBtn}>
      <div className='table-multi-select-filter'>
        <Select
          options={options}
          onChange={onSelectOne}
          value={null}
          autoFocus
          sortOptions
        />
        <div className='selected-options-wrapper'>
          {values.map(getSelectedOption)}
        </div>
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

export default MultiSelectFilter
