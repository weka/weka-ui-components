import clsx from 'clsx'
import { ExtendedRow, TableExtraClasses, ExtendedCell } from '../../types'
import { Arrow } from '~svgs'
import { flexRender } from '@tanstack/react-table'
import React, { FC, useMemo } from 'react'

interface TableCellProps<Data, Value> {
  cell: ExtendedCell<Data, Value>
  row: ExtendedRow<Data>
  extraClasses?: TableExtraClasses
  onRowClick?: (values: Data) => void
  RowSubComponent?: FC
  grouping?: string[]
  rowIndex: number
}

function TableCell<Data, Value>(props: TableCellProps<Data, Value>) {
  const {
    cell,
    row,
    extraClasses,
    onRowClick,
    RowSubComponent,
    grouping,
    rowIndex
  } = props

  const shouldShowAggregated = useMemo(() => {
    if (cell.getIsAggregated()) {
      return true
    }

    if (!grouping || !row.groupingColumnId) {
      return false
    }

    const cellGroupIndex = cell.column.getGroupedIndex()
    const currentGroupIndex = grouping.indexOf(row.groupingColumnId)

    return cellGroupIndex > currentGroupIndex && cell.row.depth < cellGroupIndex
  }, [cell, row, grouping])

  const isActionCell = cell.column.columnDef.meta?._type === 'action'

  return (
    <td
      key={cell.id}
      className={clsx(
        isActionCell ? 'td-actions' : 'table-cell',
        extraClasses?.tableCell
      )}
      {...(!isActionCell && {
        style: {
          position: 'relative',
          width: cell.column.getSize(),
          flex: `${cell.column.getSize()} 0 auto`
        },
        onClick: () => {
          if (row.getIsGrouped()) {
            row.toggleExpanded()
          } else {
            const onCellClick = cell.column.columnDef.meta?.cell?.onClick

            if (onCellClick) {
              onCellClick(cell)
            } else if (RowSubComponent) {
              row.toggleExpanded()
            } else if (onRowClick) {
              onRowClick(row.original)
            }
          }
        }
      })}
    >
      {cell.getIsGrouped() ? (
        <>
          <span className='expand-cell expand-group'>
            {row.getIsExpanded() ? <Arrow /> : <Arrow className='rotate270' />}
          </span>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </>
      ) : shouldShowAggregated ? (
        flexRender(cell.column.columnDef.aggregatedCell, cell.getContext())
      ) : cell.getIsPlaceholder() ? null : (
        <>
          {grouping &&
            RowSubComponent &&
            !row.getIsGrouped() &&
            (rowIndex === 0 ||
              row.getVisibleCells()[rowIndex - 1].getIsPlaceholder()) && (
              <span className='expand-cell expand-group'>
                {row.getIsExpanded() ? (
                  <Arrow />
                ) : (
                  <Arrow className='rotate270' />
                )}
              </span>
            )}
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </>
      )}
    </td>
  )
}

export default TableCell
