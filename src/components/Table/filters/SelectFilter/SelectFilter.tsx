import React, { useState } from 'react'
import Select from '../../../inputs/Select'
import Utils from '../../../../utils'
import FilterWrapper from '../FilterWrapper/FilterWrapper'
import { UseFiltersColumnProps } from 'react-table'
import { EMPTY_STRING } from '../../../../consts'

import './selectFilter.scss'

interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
  Header: string
  id?: string
  [key: string]: any
}

function SelectFilter({ column }: {[key: string]: any}) {
  const { filterValue, setFilter, preFilteredRows, id = EMPTY_STRING, Header } = column as ExtendedFiltersColumn<object>
  const [value, setValue] = useState(Utils.isEmpty(filterValue) ? [] : filterValue)

  const options = React.useMemo(() => {
    const optionsSet = new Set()
    preFilteredRows.forEach((row) => {
      optionsSet.add(row.values[id])
    })
    return [...optionsSet.values()]
  }, [id, preFilteredRows])

  const formatOptions = options.map((option) => Utils.formatOption(option as string))

  return (
    <FilterWrapper setFilter={setFilter} value={value} columnTitle={Header}>
      <div className='table-select-filter'>
        <Select options={formatOptions} onChange={setValue} value={value} autoFocus />
      </div>
    </FilterWrapper>
  )
}

export default SelectFilter
