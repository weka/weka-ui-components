import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { EMPTY_STRING } from '../../../../utils/consts'
import FilterWrapper from '../FilterWrapper'

import './textFilter.scss'

function TextFilter({ column: { filterValue, setFilter, Header } }) {
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

TextFilter.propTypes = { column: propTypes.object.isRequired }

export default TextFilter
