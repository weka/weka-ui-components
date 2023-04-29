import React, { useState, useEffect } from 'react'
import Select from '../../../inputs/Select'
import FilterWrapper from '../FilterWrapper'
import Utils from '../../../../utils'
import { Close } from '../../../../svgs'
import { EMPTY_STRING } from '../../../../consts'
import { Row, UseFiltersColumnProps } from 'react-table'

import './multiSelectFilter.scss'

interface ExtendedFiltersColumn<T extends object> extends UseFiltersColumnProps<T> {
  fixedOptions: Array<any>
  Header: string
  id?: string
  [key: string]: any
}

function MultiSelectFilter({ column }: ExtendedFiltersColumn<object>) {
  const { filterValue, setFilter, customSetFilter, preFilteredRows, id = EMPTY_STRING, fixedOptions, Header } = column
  // eslint-disable-next-line no-nested-ternary
  const formatValue = filterValue === undefined ? [] : Array.isArray(filterValue) ? filterValue : [filterValue]
  const [value, setValue] = useState(formatValue)

  const formattedFixedOptions =
    fixedOptions &&
    React.useMemo(() => {
      const optionsSet = new Set()
      fixedOptions.forEach((option: string) => {
        if (value && !value.includes(option)) {
          optionsSet.add(option)
        }
      })
      return [...optionsSet.values()]
    }, [id, fixedOptions, value])

  const options =
    formattedFixedOptions ||
    React.useMemo(() => {
      const optionsSet = new Set()
      preFilteredRows?.forEach((row: Row) => {
        if (value) {
          const rowValue: string | string[] | undefined = row.values[id]

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
      })

      return [...optionsSet.values()]
    }, [id, preFilteredRows, value])

  const formatOptions = options.map((option: string) => Utils.formatOption(option))

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
