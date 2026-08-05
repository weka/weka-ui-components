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
  loading?: boolean
  onRowClick?: (row: TData) => void
  activeRowId?: string | number
  getRowId?: (row: TData) => string | number | null | undefined
  renderCell?: (cell: Cell<TData, unknown>) => ReactNode
}

export function TableContent<TData>({
  rows,
  emptyMessage,
  loading = false,
  onRowClick,
  activeRowId,
  getRowId,
  renderCell
}: Readonly<TableContentProps<TData>>) {
  if (loading) {
    return null
  }

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

  const isActiveRow = (row: Row<TData>): boolean => {
    if (
      activeRowId === undefined ||
      activeRowId === null ||
      row.getIsGrouped()
    ) {
      return false
    }

    const rowId = getRowIdValue(row.original)
    if (rowId === undefined || rowId === null) {
      return false
    }
    return rowId === activeRowId
  }

  const handleRowClick = (row: Row<TData>) => {
    if (row.getIsGrouped()) {
      row.toggleExpanded()
      return
    }
    onRowClick?.(row.original)
  }

  return (
    <>
      {rows.map((row, index) => {
        const isGroupRow = row.getIsGrouped()
        return (
          <tr
            key={row.id}
            data-row-id={isGroupRow ? row.id : getRowIdValue(row.original)}
            onClick={() => handleRowClick(row)}
            className={clsx(
              styles.tableRow,
              index % ROW_PARITY_DIVISOR === 0 ? styles.evenRow : styles.oddRow,
              {
                [styles.activeRow]: isActiveRow(row),
                [styles.groupRow]: isGroupRow,
                [styles.clickable]: isGroupRow || onRowClick !== undefined
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
