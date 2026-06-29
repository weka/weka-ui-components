import type { ReactNode } from 'react'

export interface RowAction<TData> {
  key: string
  text?: string
  content?: (row: TData) => ReactNode
  icon?: ReactNode
  action?: (row: TData) => void
  hideAction?: (row: TData) => boolean
  disabled?: (row: TData) => boolean
  disabledTooltip?: string | ((row: TData) => string)
  extraClass?: string
  header?: boolean
  indent?: boolean
}
