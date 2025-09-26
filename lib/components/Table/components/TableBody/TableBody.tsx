import React, { RefObject } from 'react'
import {
  ExtendedRow,
  RowAction,
  TableExtraClasses,
  ExtendedTable
} from '../../types'
import TableRow from '../TableRow'
import { useInfiniteScroll } from '../../hooks'

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

function TableBodyComponent<Data>(props: TableBodyProps<Data>) {
  const {
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
  } = props

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
            row={row}
            columns={allColumns}
            isExpandable={isExpandable}
            grouping={grouping}
            RowSubComponent={RowSubComponent}
            onRowClick={onRowClick}
            onToggleExpand={onToggleExpand}
            checkRowSelected={checkRowSelected}
            checkRowHighlighted={checkRowHighlighted}
            rowActions={rowActions}
            hasEmptyActionsCell={hasEmptyActionsCell}
            isResizable={isResizable}
            disableActionsPortal={disableActionsPortal}
            extraClasses={extraClasses}
            rowCanExpand={
              isExpandable && (getRowCanExpand?.(row.original) ?? true)
            }
            expandedRows={expandedRows}
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

const TableBody: typeof TableBodyComponent = ({ table, ...props }) => {
  return table.getState().columnSizingInfo.isResizingColumn ? (
    <MemoizedTableBody table={table} {...props} />
  ) : (
    <TableBodyComponent table={table} {...props} />
  )
}

export default TableBody
