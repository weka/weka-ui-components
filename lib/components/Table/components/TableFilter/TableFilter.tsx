import type { BaseFilterProps } from '../../types'

import type { ComponentType } from 'react'

import { TABLE_FILTERS_MAP } from '../../tableConsts'

export type FilterTypes = keyof typeof TABLE_FILTERS_MAP

function TableFilter<Data>({ table, column }: BaseFilterProps<Data, unknown>) {
  const filterDef = column.columnDef.meta?.filter

  if (!filterDef) {
    throw new Error('Filter definition not found')
  }

  // Each filter types its own options; they all share BaseFilterProps
  const FilterComponent = TABLE_FILTERS_MAP[
    typeof filterDef === 'string' ? filterDef : filterDef.type
  ].component as ComponentType<
    BaseFilterProps<Data, unknown> & { filterOptions: object }
  >

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
