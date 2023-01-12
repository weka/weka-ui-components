import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { Select } from '@weka.io/weka-ui-components'
import FilterWrapper from '../FilterWrapper'
import Utils from '../../../../utils/utils'
import SVGS from '../../../../static/svgs'

import './multiSelectFilter.scss'

function MultiSelectFilter({ column: { filterValue, setFilter, preFilteredRows, id, fixedOptions, Header } }) {
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

  const onSelectOne = (optionSelected) => {
    setValue([...value, optionSelected].sort())
  }

  const onUnselectOne = (optionUnselected) => {
    const filterSelect = value.filter((option) => option !== optionUnselected)
    setValue(filterSelect)
  }

  const getSelectedOption = (selectOption) => (
    <div key={selectOption} className='selected-option'>
      <SVGS.Close onClick={() => onUnselectOne(selectOption)} />
      <span className='dropdown-lines-1'>
        {selectOption}
      </span>
    </div>
  )

  return (
    <FilterWrapper setFilter={setFilter} value={value} columnTitle={Header}>
      <div className='table-multi-select-filter'>
        <Select options={formatOptions} onChange={onSelectOne} value={null} autoFocus sortOptions />
        <div className='selected-options-wrapper'>
          {value.map(getSelectedOption)}
        </div>
      </div>
    </FilterWrapper>
  )
}

MultiSelectFilter.propTypes = { column: propTypes.object.isRequired }

export default MultiSelectFilter
