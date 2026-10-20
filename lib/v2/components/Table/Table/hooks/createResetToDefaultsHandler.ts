import type { SortDirection } from './useInitialSorting'
import type { ColumnDef, Table, VisibilityState } from '@tanstack/react-table'

import { deriveDefaultVisibility } from './useColumnVisibility'
import { deriveDefaultSorting } from './useInitialSorting'

interface ResetToDefaultsParams<TData> {
  table: Table<TData>
  columns: ColumnDef<TData>[]
  defaultColumnVisibility?: VisibilityState
  defaultSortColumn?: string
  defaultSortDirection: SortDirection
  onResetToDefaults?: () => void
}

/**
 * Builds the settings menu's "Reset to defaults" handler, or `undefined` when
 * the consumer did not opt in. Widths return to the column definitions' sizes
 * (not `initialColumnSizing`); visibility and sorting are set through the
 * table so `onColumnVisibilityChange` and `onExternalSortingChange` fire like
 * for any other change.
 */
export function createResetToDefaultsHandler<TData>({
  table,
  columns,
  defaultColumnVisibility,
  defaultSortColumn,
  defaultSortDirection,
  onResetToDefaults
}: ResetToDefaultsParams<TData>) {
  if (!onResetToDefaults) {
    return undefined
  }

  return () => {
    table.resetColumnSizing(true)
    table.setColumnVisibility(
      defaultColumnVisibility ?? deriveDefaultVisibility(columns)
    )
    table.setSorting(
      deriveDefaultSorting(defaultSortColumn, defaultSortDirection, columns)
    )
    onResetToDefaults()
  }
}
