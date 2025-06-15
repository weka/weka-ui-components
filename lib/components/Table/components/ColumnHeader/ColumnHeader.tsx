import React from 'react'
import { ExtendedHeaderGroup, ExtendedTable, RowAction } from '../../types'
import { flexRender } from '@tanstack/react-table'
import Tooltip from '../../../Tooltip'
import clsx from 'clsx'
import { LongArrow } from 'svgs'
import TableFilter from '../TableFilter'
import { Utils } from '../../../../main'
import { EMPTY_STRING } from 'consts'
import ScrollToTop from '../ScrollToTop'

interface HeaderGroupProps<Data> {
  headerGroup: ExtendedHeaderGroup<Data>
  table: ExtendedTable<Data>
  isExpandable?: boolean
  rowActions?: RowAction<Data>[]
  hasEmptyActionsCell?: boolean
  isResizable: boolean
  scrollElement: HTMLElement | null
  showScrollToTop: boolean
}

function ColumnHeader<Data>(props: HeaderGroupProps<Data>) {
  const {
    headerGroup,
    table,
    isExpandable,
    rowActions,
    hasEmptyActionsCell,
    isResizable,
    scrollElement,
    showScrollToTop
  } = props

  const toggleSortBy = (columnId: string) => {
    table.setSorting((prevSorting) => [
      {
        id: columnId,
        desc: prevSorting[0]?.id === columnId ? !prevSorting[0]?.desc : false
      }
    ])
  }

  return (
    <tr key={headerGroup.id}>
      {isExpandable && (
        <th className='table-header header-cell-for-expandable' />
      )}

      {headerGroup.headers.map((header, index) => {
        const column = header.column
        const isHeaderEmpty = column.columnDef.header === EMPTY_STRING

        const canSort = column.getCanSort()
        const columnSorted = column.getIsSorted()

        const isActionCell = column.columnDef.meta?._type === 'action'

        return (
          <th
            colSpan={header.colSpan}
            key={header.id}
            className={clsx(
              'table-header',
              isActionCell && 'table-header-actions'
            )}
            {...(!isActionCell && {
              style: {
                position: 'relative',
                width: header.getSize(),
                flex: `${header.getSize()} 0 auto`
              }
            })}
          >
            <div className='table-header-content'>
              <Tooltip data={column.columnDef.meta?.headerTooltip}>
                <span
                  className={clsx({
                    ['table-headline']: true,
                    ['disable-sort']: !canSort
                  })}
                  onClick={() => {
                    if (canSort) {
                      toggleSortBy(column.id)
                    }
                  }}
                >
                  {flexRender(column.columnDef.header, header.getContext())}
                </span>
              </Tooltip>
              {column.columnDef?.meta?.filter && (
                <TableFilter column={column} />
              )}
              {canSort && (columnSorted || isHeaderEmpty) && (
                <div
                  className={clsx(
                    'table-sort',
                    !columnSorted && isHeaderEmpty && 'table-sort-no-title'
                  )}
                  onClick={() => toggleSortBy(column.id)}
                >
                  {columnSorted === 'desc' ? (
                    <LongArrow className='rotate180' />
                  ) : (
                    <LongArrow />
                  )}
                </div>
              )}
              {header.column.getCanResize() && (
                <div
                  onMouseDown={header.getResizeHandler()}
                  className={clsx({
                    ['column-resizer']: true,
                    ['column-resizer-is-resizing']:
                      header.column.getIsResizing()
                  })}
                />
              )}

              {showScrollToTop && index === headerGroup.headers.length - 1 ? (
                <ScrollToTop scrollElement={scrollElement} />
              ) : null}
            </div>
          </th>
        )
      })}
      {(!Utils.isEmpty(rowActions) || (hasEmptyActionsCell && isResizable)) && (
        <th className='table-header table-header-actions'>{EMPTY_STRING}</th>
      )}
    </tr>
  )
}

export default ColumnHeader
