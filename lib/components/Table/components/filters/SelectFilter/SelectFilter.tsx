import React, { useMemo, useState } from 'react'
import Select from '../../../../inputs/Select'
import Utils from 'utils'
import FilterWrapper from '../../FilterWrapper'
import { ExtendedFilterProps } from '../../../types'

import './selectFilter.scss'

export interface SelectFilterOptions {
  fixedOptions?: string[]
}

function SelectFilter<Data, Value>({
  table,
  column,
  filterOptions
}: ExtendedFilterProps<Data, Value, SelectFilterOptions>) {
  const { fixedOptions } = filterOptions
  const filterValue = column.getFilterValue()

  const [value, setValue] = useState(
    Utils.isEmpty(filterValue) ? [] : filterValue
  )

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

  return (
    <FilterWrapper column={column} value={value}>
      <div className='table-select-filter'>
        <Select options={options} onChange={setValue} value={value} autoFocus />
      </div>
    </FilterWrapper>
  )
}

export default SelectFilter
