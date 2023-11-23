import React, { ReactNode, useRef } from 'react'

import Loader from '../Loader'
import clsx from 'clsx'
import { EMPTY_STRING, NOP } from '../../consts'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table'

interface TableProps<Data extends Record<string, unknown>> {
  columns: Column<Data>[]
  data: Data[]
  filterCategory: string
  title?: string
  maxRows?: number
  rowActions?: RowAction[]
  emptyMessage?: string
  tableActions?: Array<ReactNode>
  defaultSort?: string
  globalFilter?: string | ((rows: Array<Row>) => Row[])
  defaultGlobalFilter?: string
  checkRowSelected?: (row: object) => boolean
  checkRowHighlighted?: (row: object) => boolean
  getRowId?: (
    originalRow: object,
    relativeIndex: number,
    parent?: Row<object> | undefined
  ) => string
  addFilterToUrl?: boolean
  RowSubComponent?: React.FC<{ row: any }>
  listenerPrefix?: string
  onRowClick?: (row?: Row) => void
  miniTable?: boolean
  fixedPageSize?: number
  disableActionsPortal?: boolean
  colPropForShowColumns?: string
  manualPagination?: boolean
  itemsAmount?: number
  canExpandAll?: boolean
  loading?: boolean
  onFiltersChanged?: (newFilters: Filters<object>) => void
  defaultDescendingSort?: boolean
  customRowActions?: CustomRowAction[]
  manualFilters?: boolean
  initialFilters?: Filter[]
  extraClasses?: {
    tableWrapper?: string
    tableLine?: string
    expandCell?: string
    tableCell?: string
  }
  /**
   * Must be memoized
   */
  groupBy?: string[]
  hasCustomDateFormat?: boolean
  customDateFormat?: string
  hasResizableColumns?: boolean
  hasEmptyActionsCell?: boolean
  collapseRowsOnLeavingPage?: boolean
  onSortChanged: (sort: { id: string; desc?: boolean }) => void
  manualSorting?: boolean
}

function Table<Values extends Record<string, unknown>>(
  props: TableProps<Values>
) {
  const {
    columns,
    data,
    rowActions = [],
    tableActions,
    title,
    defaultSort = EMPTY_STRING,
    globalFilter,
    defaultGlobalFilter = EMPTY_STRING,
    checkRowSelected,
    checkRowHighlighted,
    getRowId,
    addFilterToUrl,
    RowSubComponent,
    listenerPrefix,
    onRowClick = NOP,
    miniTable,
    filterCategory,
    fixedPageSize,
    disableActionsPortal,
    maxRows,
    emptyMessage,
    colPropForShowColumns,
    manualPagination,
    itemsAmount,
    canExpandAll = false,
    loading,
    onFiltersChanged,
    defaultDescendingSort = false,
    customRowActions,
    onSortChanged,
    manualSorting,
    manualFilters,
    extraClasses,
    initialFilters: initialUserFilters,
    groupBy,
    hasCustomDateFormat,
    customDateFormat,
    hasResizableColumns = false,
    hasEmptyActionsCell = false,
    collapseRowsOnLeavingPage = false
  } = props

  const tableInstance = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  const { rows } = tableInstance.getRowModel()

  const isEmpty = !rows.length
  const tableClass = clsx({
    'empty-table': isEmpty,
    'react-table': true
  })
  const wrapperClasses = clsx({
    'mini-table': miniTable,
    'scroll-wrapper': true
  })
  const tableRef = useRef<null | HTMLDivElement>(null)
  const isExpandable = !!RowSubComponent

  return (
    <div className={clsx('react-table-wrapper', extraClasses?.tableWrapper)}>
      {/* {!miniTable && (
        <div className='table-top'>
          <div>
            <span className='heading-4'>{title}</span>
            <span className='sub-title bold'>
              {`${itemsAmount || rows.length} ${
                maxRows ? `(max ${maxRows})` : EMPTY_STRING
              }`}
            </span>
            {allColumns.length > 2 && (
              <ShowColumns
                columns={allColumns}
                colProperty={colPropForShowColumns || 'Header'}
              />
            )}
            {canExpandAll && isExpandable && (
              <span
                {...getToggleAllRowsExpandedProps()}
                className='table-manipulations-btn'
              >
                <Tooltip
                  data={isAllRowsExpanded ? 'Collapse all' : 'Expand all'}
                >
                  <IconButton onClick={toggleAllRowsExpanding}>
                    <ThinArrow
                      className={`${
                        isAllRowsExpanded ? 'rotate180' : EMPTY_STRING
                      }`}
                    />
                  </IconButton>
                </Tooltip>
              </span>
            )}
            {hasResizableColumns && (
              <span
                className={clsx({
                  ['table-manipulations-btn']: true,
                  ['resizing-btn-is-on']: isResizable
                })}
              >
                <Tooltip
                  data={`${isResizable ? 'Disable' : 'Enable'} column resizing`}
                >
                  <IconButton onClick={toggleResizable}>
                    <ColumnResize />
                  </IconButton>
                </Tooltip>
              </span>
            )}
            {hasResizableColumns && (
              <span className='table-manipulations-btn'>
                <Tooltip data='Reset column resizing'>
                  <IconButton onClick={resetResizing}>
                    <ColumnResizeReset />
                  </IconButton>
                </Tooltip>
              </span>
            )}
          </div>
          {!Utils.isEmpty(cleanFilters) && (
            <div className='table-filters'>
              {!Utils.isEmpty(cleanFilters) &&
                cleanFilters.map(({ id, value }) => (
                  <FilterBox
                    key={id}
                    name={id}
                    value={value}
                    onDelete={() => {
                      setFilter(id, undefined)
                    }}
                    hasCustomDateFormat={hasCustomDateFormat}
                    customDateFormat={customDateFormat}
                  />
                ))}
              <div className='table-filters-clear'>
                <Tooltip data='Clear Filters'>
                  <IconButton
                    onClick={() => {
                      setAllFilters([])
                    }}
                  >
                    <ClearFilters />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
          <div className='table-actions'>{tableActions}</div>
        </div>
      )} */}
      {!loading ? (
        <div className={wrapperClasses} ref={tableRef}>
          <table className={tableClass}>
            <tbody className='table-body'>
              {rows.map((row) => {
                return (
                  <React.Fragment key={row.id}>
                    <tr>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            className={clsx(
                              'table-cell',
                              extraClasses?.tableCell
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}

      {/* {(!miniTable || fixedPageSize) && !manualPagination && (
      <div className='footer'>
        <div className='pagination-wrapper'>
          <div className='pagination'>
            <Tooltip data={canPreviousPage ? 'First Page' : EMPTY_STRING}>
              <LastArrow
                onClick={() => gotoPage(0)}
                className='rotate180'
                disabled={!canPreviousPage}
              />
            </Tooltip>
            <Tooltip data={canPreviousPage ? 'Previous Page' : EMPTY_STRING}>
              <Arrow
                onClick={previousPage}
                className='rotate90'
                disabled={!canPreviousPage}
              />
            </Tooltip>
            <span className='note'>
              {`${pageIndex + 1} / ${pageCount || 1}`}
            </span>
            <Tooltip data={canNextPage ? 'Next Page' : EMPTY_STRING}>
              <Arrow
                onClick={nextPage}
                className='rotate270'
                disabled={!canNextPage}
              />
            </Tooltip>
            <Tooltip data={canNextPage ? 'Last Page' : EMPTY_STRING}>
              <LastArrow
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    )} */}
    </div>
  )
}

export default Table
