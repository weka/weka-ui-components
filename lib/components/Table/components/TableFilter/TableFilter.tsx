import { TABLE_FILTERS_MAP } from '../../tableConsts'
import { BaseFilterProps } from '../../types'

import React from 'react'

export type FilterTypes = keyof typeof TABLE_FILTERS_MAP

function TableFilter<Data>(props: BaseFilterProps<Data, unknown>) {
  const { column } = props

  const filterDef = column.columnDef.meta?.filter

  if (!filterDef) {
    throw new Error('Filter definition not found')
  }

  const FilterComponent =
    TABLE_FILTERS_MAP[
      typeof filterDef === 'string' ? filterDef : filterDef.type
    ].component

  return (
    <FilterComponent
      column={column}
      filterOptions={
        typeof filterDef === 'object' && filterDef.options
          ? filterDef.options
          : {}
      }
    />
  )
}

export default TableFilter
