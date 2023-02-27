import React from 'react'
import FilterHeader from './FilterHeader'

const FilterHeaderWrapper: typeof FilterHeader = (props) => (
  <FilterHeader {...props} />
)

export default React.memo(FilterHeaderWrapper)
