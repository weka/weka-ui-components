import type { Column, ColumnDef, FilterFn, Table } from '@tanstack/react-table'
import '@tanstack/react-table'
import {
  DateFilterOptions,
  FilterTypes,
  MultiSelectFilterOptions,
  SelectFilterOptions
} from './components'

export type TData = Record<string, unknown>

export type ExtendedTable<Data extends TData> = Table<Data>

export type ExtendedColumnDef<Data extends TData> = ColumnDef<Data, any>

export type ExtendedColumnDefWithId<Data extends TData> =
  ExtendedColumnDef<Data> & { id: string }

export type ExtendedColumn<Data extends TData> = Column<Data, unknown>

interface FilterDef<Type extends FilterTypes, FilterOptions> {
  type: Type
  filterFn?: FilterFn<TData>
  options?: FilterOptions
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    defaultHidden?: boolean
    tooltip?: string
    filter:
      | FilterTypes
      | FilterDef<'select', SelectFilterOptions>
      | FilterDef<'multiSelect', MultiSelectFilterOptions>
      | FilterDef<'date', DateFilterOptions>
  }
}

export type BaseFilterProps<Data extends TData> = {
  column: ExtendedColumn<Data>
}

export type ExtendedFilterProps<
  Data extends TData,
  FilterOptions = unknown
> = BaseFilterProps<Data> & {
  filterOptions: FilterOptions
}
