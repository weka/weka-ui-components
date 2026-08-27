import type { ColumnWithHeader } from './filterUtils'
import type { ColumnDef, FilterFn, Header, Row } from '@tanstack/react-table'

import { EMPTY_STRING, FILTER_TYPES } from '#v2/utils/consts'

import { getColumnId as getGenericColumnId } from './filterUtils'

/**
 * Resolves a column's id from a TanStack `ColumnDef` (id → accessorKey →
 * accessorFn.name). Thin `ColumnDef`-typed wrapper over the generic
 * `filterUtils.getColumnId` so table code keeps its `ColumnDef<TData>` typing.
 */
export function getColumnId<TData>(col: ColumnDef<TData>): string | undefined {
  return getGenericColumnId(col as ColumnWithHeader)
}

/** True when a column can be sorted (sorting not disabled and it has an id) */
export function isSortableColumn<TData>(col: ColumnDef<TData>): boolean {
  const columnId = getColumnId(col)
  return col.enableSorting !== false && Boolean(columnId)
}

/** Collects the resolvable column ids from a list of column defs */
export function extractColumnIds<TData>(columns: ColumnDef<TData>[]): string[] {
  return columns
    .map((col) => getColumnId(col))
    .filter((id): id is string => Boolean(id))
}

/**
 * multiSelect filterFn — passes when the filter array is empty or includes the
 * cell value (OR semantics across the selected options).
 */
export function multiSelectFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true
  }
  return filterValue.includes(row.getValue<string>(columnId))
}

/**
 * text filterFn — case-insensitive substring match on the stringified cell
 * value, so numeric cells (e.g. IDs) stay searchable. Matches TanStack's
 * `includesString` semantics for string cells (which `auto` would pick), and
 * fixes numeric cells, where `auto` resolves to a range filter that a text
 * value can't satisfy.
 */
export function textFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  if (
    filterValue === undefined ||
    filterValue === null ||
    filterValue === EMPTY_STRING
  ) {
    return true
  }
  return String(row.getValue<number | string>(columnId))
    .toLowerCase()
    .includes(String(filterValue).toLowerCase())
}

/**
 * Default row predicate for a declared filter type. Only types with one
 * correct generic behavior get a default (multiSelect, text); range and date
 * types keep TanStack's resolution unless the column supplies its own.
 */
function defaultFilterFnForType<TData>(
  filterType: string | undefined
): FilterFn<TData> | undefined {
  if (filterType === FILTER_TYPES.MULTISELECT) {
    return multiSelectFilterFn as FilterFn<TData>
  }
  if (filterType === FILTER_TYPES.TEXT) {
    return textFilterFn as FilterFn<TData>
  }
  return undefined
}

function declaredFilterType<TData>(col: ColumnDef<TData>): string | undefined {
  const filterMeta = (col.meta as { filter?: FilterMeta } | undefined)?.filter
  return filterMeta?.type
}

/**
 * Applies the table's default capabilities (sorting, resizing, filtering) to
 * each column, honoring any explicit per-column opt-outs. Columns that declare
 * a `meta.filter.type` get the matching row predicate by default; an explicit
 * `filterFn` on the column always wins.
 */
export function buildTableColumns<TData>(
  columns: ColumnDef<TData>[],
  hasResizableColumns: boolean
): ColumnDef<TData>[] {
  return columns.map((col) => ({
    ...col,
    enableSorting: col.enableSorting !== false,
    enableResizing: hasResizableColumns && col.enableResizing !== false,
    enableColumnFilter: col.enableColumnFilter !== false,
    filterFn: col.filterFn ?? defaultFilterFnForType(declaredFilterType(col))
  }))
}

interface FilterMeta {
  type?: string
  options?: unknown[] | { fixedOptions?: unknown[] }
}

function hasDirectOptions(filterMeta: FilterMeta | undefined): boolean {
  return Array.isArray(filterMeta?.options) && filterMeta.options.length > 0
}

function hasFixedOptions(filterMeta: FilterMeta | undefined): boolean {
  if (!filterMeta?.options) {
    return false
  }

  const { options } = filterMeta
  if (typeof options !== 'object' || options === null) {
    return false
  }

  if (!('fixedOptions' in options)) {
    return false
  }

  const fixedOptions = (options as { fixedOptions?: unknown[] }).fixedOptions
  return Array.isArray(fixedOptions) && fixedOptions.length > 0
}

function hasAnyOptions(filterMeta: FilterMeta | undefined): boolean {
  return hasDirectOptions(filterMeta) || hasFixedOptions(filterMeta)
}

/**
 * Decides whether a column header should expose a filter control. Multiselect
 * filters are only shown when they actually have options to choose from.
 */
export function getCanShowFilter<TData>(
  header: Header<TData, unknown>
): boolean {
  const { column } = header
  const { columnDef } = column

  if (!columnDef.meta || typeof columnDef.meta !== 'object') {
    return column.getCanFilter()
  }

  const meta = columnDef.meta as Record<string, unknown>
  const filterMeta = meta.filter as FilterMeta | undefined

  const canFilter = column.getCanFilter()

  if (!canFilter) {
    return false
  }

  const isMultiSelectFilter = filterMeta?.type === FILTER_TYPES.MULTISELECT
  if (isMultiSelectFilter) {
    return hasAnyOptions(filterMeta)
  }

  return true
}
