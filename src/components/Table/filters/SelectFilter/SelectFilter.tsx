import React, { useState } from 'react'
import Select from '../../../inputs/Select'
import Utils from '../../../../utils'
import FilterWrapper from '../FilterWrapper/FilterWrapper'
import { Row, UseFiltersColumnProps } from 'react-table'
import { EMPTY_STRING } from '../../../../consts'

import './selectFilter.scss'

interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
  fixedOptions: Array<any>
  Header: string
  id?: string
  [key: string]: any
}

function SelectFilter({ column }: ExtendedFiltersColumn<object>) {
  const { filterValue, setFilter, preFilteredRows, id = EMPTY_STRING, Header, fixedOptions } = column
  const [value, setValue] = useState(Utils.isEmpty(filterValue) ? [] : filterValue)

  const formattedFixedOptions =
    fixedOptions &&
    React.useMemo(() => {
      const optionsSet = new Set()
      fixedOptions.forEach((option: string) => {
        optionsSet.add(option)
      })
      return [...optionsSet.values()]
    }, [id, fixedOptions])

  const options =
    formattedFixedOptions ||
    React.useMemo(() => {
      const optionsSet = new Set()
      preFilteredRows?.forEach((row: Row) => {
        optionsSet.add(row.values[id])
      })
      return [...optionsSet.values()]
    }, [id, preFilteredRows])

  const formatOptions = options.map((option: string) => Utils.formatOption(option))

  return (
    <FilterWrapper setFilter={setFilter} value={value} columnTitle={Header}>
      <div className='table-select-filter'>
        <Select options={formatOptions} onChange={setValue} value={value} autoFocus />
      </div>
    </FilterWrapper>
  )
}

export default SelectFilter
