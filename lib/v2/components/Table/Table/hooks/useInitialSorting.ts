import type { ColumnDef, SortingState } from '@tanstack/react-table'

import { useState } from 'react'

import { getColumnId, isSortableColumn } from '../../tableUtils'

export type SortDirection = 'asc' | 'desc'

/**
 * Resolves the table's default sorting: an explicit default column if given,
 * otherwise the first sortable column, in the requested direction.
 */
export function deriveDefaultSorting<TData>(
  defaultSortColumn: string | undefined,
  defaultSortDirection: SortDirection,
  columns: ColumnDef<TData>[]
): SortingState {
  if (defaultSortColumn) {
    return [{ id: defaultSortColumn, desc: defaultSortDirection === 'desc' }]
  }

  const firstSortableColumn = columns.find(isSortableColumn)

  if (firstSortableColumn) {
    const columnId = getColumnId(firstSortableColumn)
    if (columnId) {
      return [{ id: columnId, desc: defaultSortDirection === 'desc' }]
    }
  }

  return []
}

/** Seeds the table's sorting state from {@link deriveDefaultSorting}. */
export function useInitialSorting<TData>(
  defaultSortColumn: string | undefined,
  defaultSortDirection: SortDirection,
  columns: ColumnDef<TData>[]
) {
  const [sorting, setSorting] = useState<SortingState>(() =>
    deriveDefaultSorting(defaultSortColumn, defaultSortDirection, columns)
  )

  return { sorting, setSorting }
}
