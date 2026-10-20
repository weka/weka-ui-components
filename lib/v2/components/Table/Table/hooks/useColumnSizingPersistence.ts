import type { ColumnSizingState, Table } from '@tanstack/react-table'

import { useEffect, useRef } from 'react'

/**
 * Reports the final column widths once per resize gesture. The table runs in
 * `onChange` resize mode, so sizing state changes on every pixel; this fires
 * only when `isResizingColumn` goes from a column id back to `false`.
 */
export function useColumnSizingPersistence<TData>(
  table: Table<TData>,
  onColumnSizingChange?: (sizing: ColumnSizingState) => void
) {
  const isResizingColumn = table.getState().columnSizingInfo.isResizingColumn
  const wasResizingRef = useRef(false)
  const callbackRef = useRef(onColumnSizingChange)

  useEffect(() => {
    callbackRef.current = onColumnSizingChange
  }, [onColumnSizingChange])

  useEffect(() => {
    const wasResizing = wasResizingRef.current
    wasResizingRef.current = Boolean(isResizingColumn)
    if (wasResizing && !isResizingColumn) {
      callbackRef.current?.(table.getState().columnSizing)
    }
  }, [isResizingColumn, table])
}
