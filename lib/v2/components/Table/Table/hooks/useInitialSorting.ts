import type { ColumnDef, SortingState } from '@tanstack/react-table'

import { useState } from 'react'

import { getColumnId, isSortableColumn } from '../../tableUtils'

export type SortDirection = 'asc' | 'desc'

/**
 * Seeds the table's sorting state: an explicit default column if given,
 * otherwise the first sortable column, in the requested direction.
 */
export function useInitialSorting<TData>(
  defaultSortColumn: string | undefined,
  defaultSortDirection: SortDirection,
  columns: ColumnDef<TData>[]
) {
  const [sorting, setSorting] = useState<SortingState>(() => {
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
  })

  return { sorting, setSorting }
}
