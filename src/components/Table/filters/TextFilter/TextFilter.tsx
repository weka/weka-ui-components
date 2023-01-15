import React, { useState, useEffect } from 'react'
import { EMPTY_STRING } from '../../../../consts'
import FilterWrapper from '../FilterWrapper'
import { UseFiltersColumnProps } from 'react-table'

import './textFilter.scss'

interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
  Header: string
  [key: string]: any
}

function TextFilter({ column }: {[key: string]: any}) {
  const { filterValue, setFilter, Header } = column as ExtendedFiltersColumn<object>
  const [value, setValue] = useState(filterValue)
  useEffect(() => {
    setValue(filterValue)
  }, [filterValue])

  return (
    <FilterWrapper setFilter={setFilter} value={value} columnTitle={Header}>
      <input
        autoFocus
        className='table-text-filter'
        value={value || EMPTY_STRING}
        onChange={(e) => {
          setValue(e.target.value || undefined)
        }}
      />
    </FilterWrapper>
  )
}

export default TextFilter
