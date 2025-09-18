import React from 'react'
import { ExtendedHeaderGroup, ExtendedTable, RowAction } from '../../types'
import { ColumnMeta, flexRender } from '@tanstack/react-table'
import Tooltip from '../../../Tooltip'
import clsx from 'clsx'
import svgs from 'svgs'
import TableFilter from '../TableFilter'
import { Utils } from '../../../../main'
import { EMPTY_STRING } from 'consts'
import ScrollToTop from '../ScrollToTop'

const { LongArrow } = svgs

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

  const getColumnStyle = <Data, Value>(
    headerId: string,
    columnMeta?: ColumnMeta<Data, Value>
  ) => {
    if (columnMeta?._type === 'action') {
      return {}
    }

    const sizeVar = `var(${Utils.makeCssVarName('header', headerId, 'size')})`
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
    <tr key={headerGroup.id}>
      {isExpandable && (
        <th className='table-header header-cell-for-expandable' />
      )}

      {headerGroup.headers.map((header, index) => {
        const column = header.column
        const isHeaderEmpty = column.columnDef.header === EMPTY_STRING

        const canSort = column.getCanSort()
        const columnSorted = column.getIsSorted()

        const columnMeta = column.columnDef.meta

        return (
          <th
            colSpan={header.colSpan}
            key={header.id}
            className={clsx('table-header', {
              'table-header-actions': columnMeta?._type === 'action'
            })}
            style={getColumnStyle(header.id, columnMeta)}
          >
            <div
              className={clsx('table-header-content', {
                'column-align-center': columnMeta?.columnAlign === 'center'
              })}
            >
              <Tooltip data={column.columnDef.meta?.headerTooltip}>
                <span
                  className={clsx('table-headline', {
                    'disable-sort': !canSort
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
                <TableFilter table={table} column={column} />
              )}
              {canSort && (columnSorted || isHeaderEmpty) && (
                <div
                  className={clsx('table-sort', {
                    'table-sort-no-title': !columnSorted && isHeaderEmpty
                  })}
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
                  className={clsx('column-resizer', {
                    'column-resizer-is-resizing': header.column.getIsResizing()
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
