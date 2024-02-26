import { BaseFilterProps, TData } from '../../types'
import {
  DateFilter,
  MultiSelectFilter,
  SelectFilter,
  SeverityFilter,
  TextFilter
} from './filters'
import React from 'react'

const filtersMap = {
  multiSelect: MultiSelectFilter,
  select: SelectFilter,
  date: DateFilter,
  text: TextFilter,
  severity: SeverityFilter
} as const

export type FilterTypes = keyof typeof filtersMap

function Filter<Data extends TData>(props: BaseFilterProps<Data>) {
  const { column } = props

  const filterDef = column.columnDef.meta?.filter

  if (!filterDef) {
    throw new Error('Filter definition not found')
  }

  const filterType = typeof filterDef === 'string' ? filterDef : filterDef.type

  const FilterComponent = filtersMap[filterType]

  return (
    <FilterComponent
      column={column}
      // too difficult to type this, rely on testing
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filterOptions={('options' in filterDef && filterDef.options) || {}}
    />
  )
}

export default Filter
