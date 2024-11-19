import React, { useState, useEffect } from 'react'
import { ExtendedFilterProps } from '../../../types'
import { EMPTY_STRING } from '~consts'
import FilterWrapper from '../../FilterWrapper'

import './textFilter.scss'

export interface TextFilterOptions {
  shouldDisableBtn?: (val: string) => boolean
  disabledBtnTooltip?: string
}

function TextFilter<Data, Value>({
  column,
  filterOptions
}: ExtendedFilterProps<Data, Value, TextFilterOptions>) {
  const filterValue = column.getFilterValue()

  if (typeof filterValue !== 'string' && filterValue !== undefined) {
    throw new Error('TextFilter only accepts string as filter value')
  }

  const [value = EMPTY_STRING, setValue] = useState(filterValue)
  useEffect(() => {
    setValue(filterValue)
  }, [filterValue])

  return (
    <FilterWrapper
      column={column}
      value={value}
      shouldDisableBtn={filterOptions.shouldDisableBtn}
      disabledBtnTooltip={filterOptions.disabledBtnTooltip}
    >
      <input
        autoFocus
        className='table-text-filter'
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        type='text'
      />
    </FilterWrapper>
  )
}

export default TextFilter
