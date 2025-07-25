import clsx from 'clsx'
import {
  ExtendedColumn,
  ExtendedRow,
  RowAction,
  TableExtraClasses
} from '../../types'
import svgs from 'svgs'
import React from 'react'
import TableCell from '../TableCell'
import ActionsCell from '../ActionsCell'
import { Utils } from '../../../../main'
import { VirtualItem } from '@tanstack/react-virtual'
import { ROW_HEIGHT } from '../../tableConsts'

const { Arrow } = svgs

interface TableRowProps<Data, Value> {
  row: ExtendedRow<Data>
  columns: ExtendedColumn<Data, Value>[]
  isExpandable?: boolean
  grouping?: string[]
  RowSubComponent?: React.FC<{ row: ExtendedRow<Data> }>
  onRowClick?: (row: Data) => void
  onToggleExpand?: (row: ExtendedRow<Data>) => void
  checkRowSelected?: (row: Data) => boolean
  checkRowHighlighted?: (row: Data) => boolean
  rowActions?: RowAction<Data>[]
  hasEmptyActionsCell?: boolean
  isResizable?: boolean
  disableActionsPortal?: boolean
  extraClasses?: TableExtraClasses
  rowCanExpand?: boolean
  expandedRows?: Record<string, boolean>
  virtualRow?: VirtualItem
  getInfScrollPropsRow?: (virtualRow: VirtualItem) => Record<string, any>
}

function TableRow<Data, Value>(props: TableRowProps<Data, Value>) {
  const {
    row,
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
    rowCanExpand,
    extraClasses,
    expandedRows = null,
    virtualRow,
    getInfScrollPropsRow
  } = props

  const isRowExpanded = expandedRows
    ? expandedRows[row.original.uuid]
    : row.getIsExpanded()
  const classes = clsx({
    'table-line': true,
    clickable: onRowClick || isExpandable,
    'is-expand': !row.getIsGrouped() && isRowExpanded,
    'is-selected': checkRowSelected?.(row.original),
    'is-highlighted': checkRowHighlighted?.(row.original),
    ...(extraClasses?.tableLine && {
      [extraClasses.tableLine]: true
    }),
    ...(virtualRow &&
      (row.index % 2 == 0
        ? {
            'first-line': true
          }
        : {
            'second-line': true
          }))
  })

  return (
    <React.Fragment key={row.id}>
      <tr
        className={classes}
        style={{
          minHeight: ROW_HEIGHT
        }}
        {...(virtualRow &&
          getInfScrollPropsRow &&
          getInfScrollPropsRow(virtualRow))}
      >
        {!grouping && isExpandable && (
          <td className={clsx('expand-cell', extraClasses?.expandCell)}>
            {rowCanExpand ? (
              <div onClick={row.getToggleExpandedHandler()}>
                {isRowExpanded ? <Arrow /> : <Arrow className='rotate270' />}
              </div>
            ) : (
              <div className='expand-placeholder' />
            )}
          </td>
        )}
        {row.getVisibleCells().map((cell, index) => (
          <TableCell
            key={cell.id}
            cell={cell}
            row={row}
            extraClasses={extraClasses}
            onRowClick={onRowClick}
            onToggleExpand={onToggleExpand}
            RowSubComponent={RowSubComponent}
            grouping={grouping}
            rowIndex={index}
          />
        ))}
        {rowActions &&
          (!Utils.isEmpty(rowActions) ||
            (hasEmptyActionsCell && isResizable)) && (
            <td className='td-actions'>
              <ActionsCell
                row={row}
                actions={rowActions}
                disablePortal={disableActionsPortal}
              />
            </td>
          )}
      </tr>
      {isRowExpanded && !row.getIsGrouped() && RowSubComponent ? (
        <tr className='sub-table-line'>
          <td colSpan={row.getVisibleCells().length}>
            <RowSubComponent row={row} />
          </td>
        </tr>
      ) : null}
    </React.Fragment>
  )
}

export default TableRow
