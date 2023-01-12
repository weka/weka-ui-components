import React, { useState } from 'react'
import propTypes from 'prop-types'
import { Select } from '@weka.io/weka-ui-components'
import Utils from '../../../../utils/utils'
import FilterWrapper from '../FilterWrapper/FilterWrapper'

import './selectFilter.scss'

function SelectFilter({ column: { filterValue, setFilter, preFilteredRows, id, Header } }) {
  const [value, setValue] = useState(Utils.isEmpty(filterValue) ? [] : filterValue)

  const options = React.useMemo(() => {
    const optionsSet = new Set()
    preFilteredRows.forEach((row) => {
      optionsSet.add(row.values[id])
    })
    return [...optionsSet.values()]
  }, [id, preFilteredRows])

  const formatOptions = options.map((option) => Utils.formatOption(option))

  return (
    <FilterWrapper setFilter={setFilter} value={value} columnTitle={Header}>
      <div className='table-select-filter'>
        <Select options={formatOptions} onChange={setValue} value={value} autoFocus />
      </div>
    </FilterWrapper>
  )
}

SelectFilter.propTypes = { column: propTypes.object.isRequired }

export default SelectFilter
