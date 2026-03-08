import type { RefObject } from 'react'
import React from 'react'

import { useInfiniteScroll } from '../../hooks'
import type {
  ExtendedRow,
  ExtendedTable,
  RowAction,
  TableExtraClasses
} from '../../types'
import TableRow from '../TableRow'

interface TableBodyProps<Data> {
  table: ExtendedTable<Data>
  isExpandable: boolean
  grouping?: string[]
  RowSubComponent?: React.FC<{ row: ExtendedRow<Data> }>
  onRowClick: (values?: Data) => void
  onToggleExpand?: (row: ExtendedRow<Data>) => void
  checkRowSelected?: (row: Data) => boolean
  checkRowHighlighted?: (row: Data) => boolean
  rowActions: RowAction<Data>[]
  hasEmptyActionsCell?: boolean
  isResizable?: boolean
  disableActionsPortal?: boolean
  extraClasses?: TableExtraClasses
  getRowCanExpand?: (row: Data) => boolean
  expandedRows?: Record<string, boolean>
  infinityScrollConfig?: {
    hasNextPage: boolean
    fetchNextPage: () => void
    isFetchingNextPage: boolean
  }
  tableRef: RefObject<HTMLDivElement>
  rows: ExtendedRow<Data>[]
}

function TableBodyComponent<Data>({
  table,
  isExpandable,
  grouping,
  RowSubComponent,
  onRowClick,
  onToggleExpand,
  checkRowSelected,
  checkRowHighlighted,
  rowActions,
  hasEmptyActionsCell,
  isResizable,
  disableActionsPortal,
  extraClasses,
  getRowCanExpand,
  expandedRows,
  infinityScrollConfig,
  tableRef,
  rows
}: TableBodyProps<Data>) {
  const allColumns = table.getAllColumns()

  const { getInfScrollPropsBody, getInfScrollPropsRow, getVirtualRows } =
    useInfiniteScroll<Data>({
      data: table.options.data,
      tableRef,
      rows,
      infinityScrollConfig
    })

  const items = infinityScrollConfig
    ? getVirtualRows()
    : rows.map((_, index) => ({ index }))

  return (
    <tbody {...getInfScrollPropsBody()}>
      {items.map((virtualRow) => {
        const row = rows[virtualRow.index]
        if (!row) {
          return null
        }

        return (
          <TableRow
            key={row.id}
            RowSubComponent={RowSubComponent}
            checkRowHighlighted={checkRowHighlighted}
            checkRowSelected={checkRowSelected}
            columns={allColumns}
            disableActionsPortal={disableActionsPortal}
            expandedRows={expandedRows}
            extraClasses={extraClasses}
            grouping={grouping}
            hasEmptyActionsCell={hasEmptyActionsCell}
            isExpandable={isExpandable}
            isResizable={isResizable}
            onRowClick={onRowClick}
            onToggleExpand={onToggleExpand}
            row={row}
            rowActions={rowActions}
            rowCanExpand={
              isExpandable ? getRowCanExpand?.(row.original) ?? true : null
            }
            {...(infinityScrollConfig && {
              virtualRow,
              getInfScrollPropsRow
            })}
          />
        )
      })}
    </tbody>
  )
}

const MemoizedTableBody = React.memo(TableBodyComponent) as typeof TableBody

const TableBody: typeof TableBodyComponent = ({ table, ...props }) =>
  table.getState().columnSizingInfo.isResizingColumn ? (
    <MemoizedTableBody
      table={table}
      {...props}
    />
  ) : (
    <TableBodyComponent
      table={table}
      {...props}
    />
  )

export default TableBody
