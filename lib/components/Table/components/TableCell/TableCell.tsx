import clsx from 'clsx'
import { ExtendedRow, TableExtraClasses, ExtendedCell } from '../../types'
import svgs from 'svgs'
import { ColumnMeta, flexRender } from '@tanstack/react-table'
import React, { FC, useMemo, useCallback } from 'react'
import Utils from 'utils'

const { Arrow } = svgs

interface TableCellProps<Data, Value> {
  cell: ExtendedCell<Data, Value>
  row: ExtendedRow<Data>
  extraClasses?: TableExtraClasses
  onRowClick?: (values: Data) => void
  onToggleExpand?: (row: ExtendedRow<Data>) => void
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
    onToggleExpand,
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

  const columnMeta = cell.column.columnDef.meta
  const isActionCell = columnMeta?._type === 'action'

  const handleToggleExpand = useCallback(() => {
    if (onToggleExpand) {
      onToggleExpand(row)
    } else {
      row.toggleExpanded()
    }
  }, [onToggleExpand, row])

  const handleCellClick = useCallback(
    (e: React.MouseEvent) => {
      const selection = window.getSelection()
      if (selection && selection.toString().length > 0) {
        e.stopPropagation()
        return
      }

      if (row.getIsGrouped()) {
        handleToggleExpand()
      } else {
        const onCellClick = columnMeta?.cell?.onClick

        if (onCellClick) {
          onCellClick(cell)
        } else if (RowSubComponent) {
          handleToggleExpand()
        } else if (onRowClick) {
          onRowClick(row.original)
        }
      }
    },
    [cell, row, onRowClick, RowSubComponent, handleToggleExpand, columnMeta]
  )

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      e.stopPropagation()
    }
  }, [])

  const getCellStyle = <Data, Value>(
    columnId: string,
    columnMeta?: ColumnMeta<Data, Value>
  ) => {
    const sizeVar = `var(${Utils.makeCssVarName('col', columnId, 'size')})`
    const baseStyle = {
      position: 'relative',
      width: `calc(${sizeVar} * 1px)`
    }

    if (columnMeta?.columnSizeUnit === 'px') {
      return {
        ...baseStyle,
        paddingLeft: '0',
        paddingRight: '0'
      }
    }

    if (columnMeta?.baseStyle) {
      return {
        ...baseStyle
      }
    }

    return {
      ...baseStyle,
      flex: `${sizeVar} 0 auto`
    }
  }

  return (
    <td
      key={cell.id}
      className={clsx(
        {
          'td-actions': isActionCell,
          'table-cell': !isActionCell,
          'column-align-center': columnMeta?.columnAlign === 'center'
        },
        extraClasses?.tableCell
      )}
      {...(!isActionCell && {
        style: getCellStyle(cell.column.id, columnMeta),
        onClick: handleCellClick,
        onMouseUp: handleMouseUp
      })}
    >
      {cell.getIsGrouped() ? (
        <>
          <span
            className='expand-cell expand-group'
            onClick={(e) => {
              e.stopPropagation()
              handleToggleExpand()
            }}
          >
            {row.getIsExpanded() ? <Arrow /> : <Arrow className='rotate270' />}
          </span>
          <span className='table-first-cell-content'>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </span>
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
              <span
                className='expand-cell expand-group'
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleExpand()
                }}
              >
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
