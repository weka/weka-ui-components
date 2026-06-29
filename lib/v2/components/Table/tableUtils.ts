import type { ColumnWithHeader } from './filterUtils'
import type { Column, ColumnDef, Header } from '@tanstack/react-table'

import { FILTER_TYPES } from '#v2/utils/consts'

import { getColumnId as getGenericColumnId } from './filterUtils'

/** Decimal places kept when serializing a column's proportional share. */
const PROPORTION_PRECISION = 6

export interface ColumnWidthContext {
  /** Id of the row-actions column, which stays at its fixed pixel size. */
  actionsColumnId: string
  /** Total pixel width of the fixed (non-proportional) columns. */
  reservedWidth: number
  /** Sum of the sizes of the proportional (data) columns. */
  proportionalTotal: number
}

/**
 * Width for a column so the table fills its container *without* stretching the
 * row-actions column: the actions column keeps its fixed pixel size, and every
 * other (data) column gets a share of the remaining width proportional to its
 * own size.
 *
 * `100%` resolves against the table width, which is floored at the columns'
 * combined size (via the table's `min-width`), so the calc result is never
 * smaller than the column's own size — on a narrow viewport columns keep their
 * size and the table scrolls horizontally instead of collapsing.
 */
export function getColumnWidth<TData>(
  column: Column<TData, unknown>,
  { actionsColumnId, reservedWidth, proportionalTotal }: ColumnWidthContext
): string | number {
  const size = column.getSize()
  if (column.id === actionsColumnId || proportionalTotal <= 0) {
    return size
  }
  const proportion = (size / proportionalTotal).toFixed(PROPORTION_PRECISION)
  return `calc((100% - ${reservedWidth}px) * ${proportion})`
}

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
 * Applies the table's default capabilities (sorting, resizing, filtering) to
 * each column, honoring any explicit per-column opt-outs.
 */
export function buildTableColumns<TData>(
  columns: ColumnDef<TData>[],
  hasResizableColumns: boolean
): ColumnDef<TData>[] {
  return columns.map((col) => ({
    ...col,
    enableSorting: col.enableSorting !== false,
    enableResizing: hasResizableColumns && col.enableResizing !== false,
    enableColumnFilter: col.enableColumnFilter !== false
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
