import type { Row } from '@tanstack/react-table'
import type { ReactNode } from 'react'

/**
 * Every callback receives the row data first and the TanStack row second, so
 * grouped tables can inspect `row.getIsGrouped()` / `row.getValue(columnId)`.
 */
export interface RowAction<TData> {
  key: string
  text?: string
  content?: (values: TData, row: Row<TData>) => ReactNode
  icon?: ReactNode
  action?: (values: TData, row: Row<TData>) => void
  hideAction?: (values: TData, row: Row<TData>) => boolean
  disabled?: (values: TData, row: Row<TData>) => boolean
  disabledTooltip?: string | ((values: TData, row: Row<TData>) => string)
  extraClass?: string
  header?: boolean
  indent?: boolean
}
