import React from 'react'

import { TABLE_FILTERS_MAP } from '../../tableConsts'
import type { BaseFilterProps } from '../../types'

export type FilterTypes = keyof typeof TABLE_FILTERS_MAP

function TableFilter<Data>({ table, column }: BaseFilterProps<Data, unknown>) {
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
      table={table}
      filterOptions={
        typeof filterDef === 'object' && filterDef.options
          ? filterDef.options
          : {}
      }
    />
  )
}

export default TableFilter
