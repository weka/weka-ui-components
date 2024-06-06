import clsx from 'clsx'
import {
  ExtendedColumn,
  ExtendedRow,
  RowAction,
  TableExtraClasses
} from '../../types'
import { Arrow } from '../../../../svgs'
import React from 'react'
import TableCell from '../TableCell'
import ActionsCell from '../ActionsCell'
import { Utils } from '../../../..'

interface TableRowProps<Data, Value> {
  row: ExtendedRow<Data>
  columns: ExtendedColumn<Data, Value>[]
  isExpandable?: boolean
  grouping?: string[]
  RowSubComponent?: React.FC
  onRowClick?: (row: Data) => void
  checkRowSelected?: (row: Data) => boolean
  checkRowHighlighted?: (row: Data) => boolean
  rowActions?: RowAction<Data>[]
  hasEmptyActionsCell?: boolean
  isResizable?: boolean
  disableActionsPortal?: boolean
  extraClasses?: TableExtraClasses
  rowCanExpand?: boolean
}

function TableRow<Data, Value>(props: TableRowProps<Data, Value>) {
  const {
    row,
    isExpandable,
    grouping,
    RowSubComponent,
    onRowClick,
    checkRowSelected,
    checkRowHighlighted,
    rowActions,
    hasEmptyActionsCell,
    isResizable,
    disableActionsPortal,
    rowCanExpand,
    extraClasses
  } = props

  const classes = clsx({
    'table-line': true,
    clickable: onRowClick || isExpandable,
    'is-expand': !row.getIsGrouped() && row.getIsExpanded(),
    'is-selected': checkRowSelected?.(row.original),
    'is-highlighted': checkRowHighlighted?.(row.original),
    ...(extraClasses?.tableLine && {
      [extraClasses.tableLine]: true
    })
  })

  return (
    <React.Fragment key={row.id}>
      <tr className={classes}>
        {rowCanExpand && !grouping && (
          <td
            className={clsx('expand-cell', extraClasses?.expandCell)}
            onClick={row.getToggleExpandedHandler()}
          >
            {row.getIsExpanded() ? <Arrow /> : <Arrow className='rotate270' />}
          </td>
        )}
        {row.getVisibleCells().map((cell, index) => (
          <TableCell
            key={cell.id}
            cell={cell}
            row={row}
            extraClasses={extraClasses}
            onRowClick={onRowClick}
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
      {row.getIsExpanded() && !row.getIsGrouped() && RowSubComponent ? (
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
