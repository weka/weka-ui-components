import type { ActiveFilter } from '../../filterUtils'
import type { Table as TanstackTable } from '@tanstack/react-table'

import { useMemo } from 'react'

const NO_ITEMS = 0

interface UseTableCountsParams<TData> {
  table: TanstackTable<TData>
  data: TData[]
  activeFilters: ActiveFilter[]
  filteredRowCount: number
  itemsAmount?: number
  manualPagination?: boolean
  isGrouped: boolean
}

/**
 * Derives the two counts the table needs: `totalItems` drives pagination — group
 * headers rather than their leaf rows once grouping is on — and `filteredCount`
 * is the number rendered next to the title.
 */
export function useTableCounts<TData>({
  table,
  data,
  activeFilters,
  filteredRowCount,
  itemsAmount,
  manualPagination,
  isGrouped
}: UseTableCountsParams<TData>) {
  // `table` is a stable reference for the component's lifetime (TanStack
  // mutates it in place), so it can't gate this memo — read the grouped
  // count as a plain number instead, which does change identity when the
  // group distribution changes even if filteredRowCount doesn't.
  const groupedRowCount = isGrouped
    ? table.getGroupedRowModel().rows.length
    : NO_ITEMS

  const totalItems = useMemo(() => {
    if (manualPagination) {
      return itemsAmount || NO_ITEMS
    }
    if (isGrouped) {
      return groupedRowCount
    }
    return filteredRowCount
  }, [
    manualPagination,
    itemsAmount,
    filteredRowCount,
    isGrouped,
    groupedRowCount
  ])

  const filteredCount = useMemo(() => {
    if (manualPagination) {
      return itemsAmount || NO_ITEMS
    }
    if (activeFilters.length === 0) {
      return itemsAmount || data.length
    }
    return filteredRowCount
  }, [
    manualPagination,
    itemsAmount,
    data.length,
    activeFilters,
    filteredRowCount
  ])

  return { totalItems, filteredCount }
}
