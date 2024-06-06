import React, { useState, useEffect, useMemo } from 'react'
import Utils from '../../../../../utils'
import { Close } from '../../../../../svgs'
import { ExtendedFilterProps } from '../../../types'
import FilterWrapper from '../../FilterWrapper'
import { Select } from '../../../../inputs'

import './multiSelectFilter.scss'

export interface MultiSelectFilterOptions {
  fixedOptions?: string[]
}

function MultiSelectFilter<Data, Value>({
  column,
  filterOptions
}: ExtendedFilterProps<Data, Value, MultiSelectFilterOptions>) {
  const filterValue = column.getFilterValue()

  const { fixedOptions } = filterOptions

  const formatValue =
    filterValue === undefined
      ? []
      : Array.isArray(filterValue)
      ? filterValue
      : [filterValue]
  const [value, setValue] = useState<string[]>(formatValue)

  const options = useMemo(() => {
    const optionsSet = new Set<string>()

    if (fixedOptions) {
      fixedOptions.forEach((option: string) => {
        if (value && !value.includes(option)) {
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
              if (!value.includes(val)) {
                optionsSet.add(val)
              }
            })
          } else if (!value.includes(rowValue)) {
            optionsSet.add(rowValue)
          }
        }
      )
    }

    return Utils.insensitiveSort([...optionsSet.values()]).map(
      Utils.formatStringOption
    )
  }, [column, fixedOptions, value])

  useEffect(() => {
    setValue(formatValue)
  }, [JSON.stringify(formatValue)])

  const onSelectOne = (optionSelected: any) => {
    setValue([...value, optionSelected].sort())
  }

  const onUnselectOne = (optionUnselected: any) => {
    const filterSelect = value.filter((option) => option !== optionUnselected)
    setValue(filterSelect)
  }

  const getSelectedOption = (selectOption: any) => (
    <div key={selectOption} className='selected-option'>
      <Close onClick={() => onUnselectOne(selectOption)} />
      <span className='dropdown-lines-1'>{selectOption}</span>
    </div>
  )

  return (
    <FilterWrapper value={value} column={column}>
      <div className='table-multi-select-filter'>
        <Select
          options={options}
          onChange={onSelectOne}
          value={null}
          autoFocus
          sortOptions
        />
        <div className='selected-options-wrapper'>
          {value.map(getSelectedOption)}
        </div>
      </div>
    </FilterWrapper>
  )
}

export default MultiSelectFilter
