import type { Cell, Row } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'

import styles from '../table.module.scss'

const EMPTY_STATE_COLSPAN = 100
const ROW_PARITY_DIVISOR = 2

export interface TableContentProps<TData> {
  rows: Row<TData>[]
  emptyMessage: string
  onRowClick?: (row: TData) => void
  activeRowId?: string | number
  getRowId?: (row: TData) => string | number | null | undefined
  renderCell?: (cell: Cell<TData, unknown>) => ReactNode
}

export function TableContent<TData>({
  rows,
  emptyMessage,
  onRowClick,
  activeRowId,
  getRowId,
  renderCell
}: Readonly<TableContentProps<TData>>) {
  if (rows.length === 0) {
    return (
      <tr>
        <td
          className={styles.emptyState}
          colSpan={EMPTY_STATE_COLSPAN}
          data-testid='table-empty-message'
        >
          {emptyMessage}
        </td>
      </tr>
    )
  }

  const renderCells = (row: Row<TData>): ReactNode[] =>
    row.getVisibleCells().map((cell): ReactNode => {
      if (renderCell) {
        return renderCell(cell)
      }

      return (
        <td
          key={cell.id}
          className={styles.tableCell}
          style={{ width: cell.column.getSize() }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      )
    })

  const getRowIdValue = (
    rowData: TData
  ): string | number | null | undefined => {
    if (getRowId) {
      return getRowId(rowData)
    }
    if (typeof rowData === 'object' && rowData !== null && 'id' in rowData) {
      return (rowData as { id: string | number }).id
    }
    return undefined
  }

  const isActiveRow = (rowData: TData): boolean => {
    if (activeRowId === undefined || activeRowId === null) {
      return false
    }

    const rowId = getRowIdValue(rowData)
    if (rowId === undefined || rowId === null) {
      return false
    }
    return rowId === activeRowId
  }

  return (
    <>
      {rows.map((row, index) => {
        const rowId = getRowIdValue(row.original)
        return (
          <tr
            key={row.id}
            data-row-id={rowId}
            onClick={() => onRowClick?.(row.original)}
            className={clsx(
              styles.tableRow,
              index % ROW_PARITY_DIVISOR === 0 ? styles.evenRow : styles.oddRow,
              {
                [styles.activeRow]: isActiveRow(row.original),
                [styles.clickable]: onRowClick !== undefined
              }
            )}
          >
            {renderCells(row)}
          </tr>
        )
      })}
    </>
  )
}
