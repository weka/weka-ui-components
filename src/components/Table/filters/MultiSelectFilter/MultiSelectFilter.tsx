import React, { useState, useEffect } from 'react'
import Select from '../../../inputs/Select'
import FilterWrapper from '../FilterWrapper'
import Utils from '../../../../utils'
import { Close } from '../../../../svgs'
import { EMPTY_STRING } from '../../../../consts'
import { UseFiltersColumnProps } from 'react-table'

import './multiSelectFilter.scss'

interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
  fixedOptions: Array<any>
  Header: string
  id?: string
  [key: string]: any
}

function MultiSelectFilter({ column }: {[key: string]: any}) {
  const { filterValue, setFilter, customSetFilter, preFilteredRows, id = EMPTY_STRING, fixedOptions, Header } = column as ExtendedFiltersColumn<object>
  // eslint-disable-next-line no-nested-ternary
  const formatValue = filterValue === undefined ? [] : Array.isArray(filterValue) ? filterValue : [filterValue]
  const [value, setValue] = useState(formatValue)
  const options = fixedOptions || React.useMemo(() => {
    const optionsSet = new Set()
    preFilteredRows.forEach((row) => {
      if (value && !value.includes(row.values[id])) {
        optionsSet.add(row.values[id])
      }
    })
    return [...optionsSet.values()]
  }, [id, preFilteredRows, value])

  const formatOptions = options.map((option) => Utils.formatOption(option))

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
      <span className='dropdown-lines-1'>
        {selectOption}
      </span>
    </div>
  )

  return (
    <FilterWrapper setFilter={customSetFilter || setFilter} value={value} columnTitle={Header}>
      <div className='table-multi-select-filter'>
        <Select options={formatOptions} onChange={onSelectOne} value={null} autoFocus sortOptions />
        <div className='selected-options-wrapper'>
          {value.map(getSelectedOption)}
        </div>
      </div>
    </FilterWrapper>
  )
}

export default MultiSelectFilter
