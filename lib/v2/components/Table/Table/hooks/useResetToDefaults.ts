import type { SortDirection } from './useInitialSorting'
import type { ColumnDef, Table, VisibilityState } from '@tanstack/react-table'

import { useEffect, useRef, useState } from 'react'

import { deriveDefaultVisibility } from './useColumnVisibility'
import { deriveDefaultSorting } from './useInitialSorting'

interface UseResetToDefaultsParams<TData> {
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
 *
 * `onResetToDefaults` runs from an effect, once, after those notifications, so
 * a consumer that clears its stored state there is not overwritten by them.
 * Call this hook after the effect that reports sorting changes: effects run in
 * declaration order, and that ordering is what puts this callback last.
 */
export function useResetToDefaults<TData>({
  table,
  columns,
  defaultColumnVisibility,
  defaultSortColumn,
  defaultSortDirection,
  onResetToDefaults
}: UseResetToDefaultsParams<TData>) {
  const isResetPendingRef = useRef(false)
  const [resetRequestCount, setResetRequestCount] = useState(0)

  useEffect(() => {
    if (!isResetPendingRef.current) {
      return
    }
    isResetPendingRef.current = false
    onResetToDefaults?.()
  }, [resetRequestCount, onResetToDefaults])

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
    isResetPendingRef.current = true
    setResetRequestCount((count) => count + 1)
  }
}
