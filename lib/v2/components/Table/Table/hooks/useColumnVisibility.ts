import type {
  ColumnDef,
  OnChangeFn,
  VisibilityState
} from '@tanstack/react-table'

import { useState } from 'react'

import { extractColumnIds, getColumnId } from '../../tableUtils'

interface ColumnMeta {
  defaultHidden?: boolean
}

interface UseColumnVisibilityParams<TData> {
  columns: ColumnDef<TData>[]
  initialColumnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
}

/**
 * Derives the initial visibility map from `column.meta.defaultHidden`. Returns
 * an empty map (all visible) when no column opts out, matching TanStack's
 * "absent key = visible" convention.
 */
export function deriveDefaultVisibility<TData>(
  columns: ColumnDef<TData>[]
): VisibilityState {
  const defaultHiddenIds = new Set(
    columns
      .filter((col) => (col.meta as ColumnMeta | undefined)?.defaultHidden)
      .map((col) => getColumnId(col))
      .filter(Boolean)
  )

  if (defaultHiddenIds.size === 0) {
    return {}
  }

  const visibility: VisibilityState = {}
  extractColumnIds(columns).forEach((id) => {
    visibility[id] = !defaultHiddenIds.has(id)
  })
  return visibility
}

/**
 * Owns the generic column-visibility state. Seeds from
 * `initialColumnVisibility` (e.g. a consumer's persisted preference) or the
 * `defaultHidden` column meta, and reports every change through
 * `onColumnVisibilityChange` so the consumer can persist it. Holds no
 * persistence itself.
 */
export function useColumnVisibility<TData>({
  columns,
  initialColumnVisibility,
  onColumnVisibilityChange
}: UseColumnVisibilityParams<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => initialColumnVisibility ?? deriveDefaultVisibility(columns)
  )

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    updater
  ) => {
    const newVisibility =
      typeof updater === 'function' ? updater(columnVisibility) : updater
    setColumnVisibility(newVisibility)
    onColumnVisibilityChange?.(newVisibility)
  }

  return {
    columnVisibility,
    setColumnVisibility,
    handleColumnVisibilityChange
  }
}
