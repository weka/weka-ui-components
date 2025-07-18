import type {
  Column,
  ColumnDef,
  FilterFn,
  Table,
  HeaderGroup,
  Cell,
  Row,
  ColumnFilter,
  SortingFn
} from '@tanstack/react-table'
import '@tanstack/react-table'
import {
  ApiCallCellOptions,
  BlocksCellOptions,
  CapacityCellOptions,
  DateCellOptions,
  DefaultCellOptions,
  IconCellOptions,
  SwitchCellOptions,
  StatusCellOptions,
  IconButtonCellOptions,
  CopyCellOptions,
  ApiCallCellName,
  CapacityCellName,
  StatusCellName,
  DateCellName,
  SwitchCellName,
  IconCellName,
  DefaultCellName,
  IconButtonCellName,
  BlocksCellName,
  CopyCellName,
  AggregatedTotalCellOptions,
  AggregatedTotalCellName
} from './exports'

import {
  DateFilterOptions,
  FilterTypes,
  MultiSelectFilterOptions,
  SelectFilterOptions,
  TextFilterOptions
} from './components'

export type ExtendedTable<Data> = Table<Data>

export type ExtendedColumnDef<Data, Value> = ColumnDef<Data, Value>
export type ExtendedColumnDefWithId<Data, Value> = ExtendedColumnDef<
  Data,
  Value
> & {
  id: string
}

export type ExtendedColumn<Data, Value> = Column<Data, Value>
export type ExtendedHeaderGroup<Data> = HeaderGroup<Data>

export type ExtendedRow<Data> = Row<Data>
export type ExtendedCell<Data, Value> = Cell<Data, Value>

export interface ExtendedCellProps<Data, Value> {
  table: ExtendedTable<Data>
  row: ExtendedRow<Data>
  column: ExtendedColumn<Data, Value>
  cell: ExtendedCell<Data, Value>
  getValue: () => unknown
  renderValue: () => unknown
  customValue?: Value
}

type FilterDef<Data, Type extends FilterTypes, FilterOptions = undefined> =
  | Type
  | {
      type: Type
      filterFn?: FilterFn<Data>
      options?: FilterOptions
    }

type CellOptions<Type, Options> = {
  type: Type
  options: Options
}

type CellDef<
  TData,
  TValue,
  Type extends string | undefined,
  Options = undefined
> = {
  onClick?: (cell: Cell<TData, TValue>) => void
} & (never | CellOptions<Type, Options>)

declare module '@tanstack/react-table' {
  interface SortingFns {
    stringSort: SortingFn<unknown>
    numberSort: SortingFn<unknown>
  }
  interface ColumnMeta<TData, TValue> {
    defaultHidden?: boolean
    headerTooltip?: string
    /**
     * `px` - fixed width in pixels.
     * `flex` - width in flex units compared to other columns. default is `flex`.
     */
    columnSizeUnit?: 'px' | 'flex'
    /**
     * `left` is default.
     */
    columnAlign?: 'left' | 'center'
    filter?:
      | FilterDef<TData, 'date', DateFilterOptions>
      | FilterDef<TData, 'multiSelect', MultiSelectFilterOptions>
      | FilterDef<TData, 'select', SelectFilterOptions>
      | FilterDef<TData, 'severity'>
      | FilterDef<TData, 'text', TextFilterOptions>
    cell?:
      | CellDef<
          TData,
          TValue,
          typeof ApiCallCellName,
          ApiCallCellOptions<TData, TValue>
        >
      | CellDef<TData, TValue, typeof CapacityCellName, CapacityCellOptions>
      | CellDef<TData, TValue, typeof StatusCellName, StatusCellOptions<TData>>
      | CellDef<TData, TValue, typeof BlocksCellName, BlocksCellOptions<TData>>
      | CellDef<TData, TValue, typeof DateCellName, DateCellOptions>
      | CellDef<TData, TValue, typeof CopyCellName, CopyCellOptions<TData>>
      | CellDef<TData, TValue, typeof SwitchCellName, SwitchCellOptions<TData>>
      | CellDef<TData, TValue, typeof IconCellName, IconCellOptions<TData>>
      | CellDef<
          TData,
          TValue,
          typeof DefaultCellName,
          DefaultCellOptions<TData, TValue>
        >
      | CellDef<
          TData,
          TValue,
          typeof IconButtonCellName,
          IconButtonCellOptions<TData>
        >
    aggregatedCell?: CellDef<
      TData,
      TValue,
      typeof AggregatedTotalCellName,
      AggregatedTotalCellOptions<TData, TValue>
    >
    columnTitle?: string
    _type?: 'column' | 'action'
  }
}

export type BaseFilterProps<Data, Value> = {
  column: ExtendedColumn<Data, Value>
}

export type ExtendedFilterProps<
  Data,
  Value,
  FilterOptions = unknown
> = BaseFilterProps<Data, Value> & {
  filterOptions: FilterOptions
}

export interface UrlFilterParser {
  (rawValue: string[] | Record<string, string[]>): unknown
}

export interface TableExtraClasses {
  tableWrapper?: string
  tableLine?: string
  expandCell?: string
  tableCell?: string
}

export interface RowAction<Data> {
  hideAction: boolean | ((rowValues: Data) => boolean)
  action?: ((rowValues: Data) => void) | (() => void)
  content?: string | ((rowValues: Data) => HTMLElement)
  disabled?: boolean | ((rowValues: Data) => boolean)
  text?: string
}

export type ExtendedColumnFilter = ColumnFilter & { defaultFilter?: boolean }
