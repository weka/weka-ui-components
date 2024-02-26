import React, { ReactNode, useEffect, useMemo, useRef } from 'react'
import _ from 'lodash'
import {
  EMPTY_STRING,
  FILTER_CHANGE_LISTENER,
  FILTER_LISTENER,
  NOP,
  SAVED_RESIZED,
  SAVED_RESIZING_ENABLED
} from '../../consts'
import Tooltip from '../Tooltip'
import {
  Arrow,
  ClearFilters,
  ThinArrow,
  ColumnResize,
  ColumnResizeReset
} from '../../svgs'
import clsx from 'clsx'
import {
  Row,
  UseExpandedRowProps,
  UseRowStateRowProps,
  CellProps,
  HeaderGroup,
  Filters
} from 'react-table'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getFacetedRowModel
} from '@tanstack/react-table'
import type { Column } from '@tanstack/react-table'
import { IconButton } from '@mui/material'
import Utils from '../../utils'
import localStorageService from '../../localStorageService'
import ShowColumns from './ShowColumns'
// import ActionsCell from './cells/ActionsCell'
// import DefaultCell from './cells/DefaultCell'
// import IconButtonCell from './cells/IconButtonCell'
import FilterBox from '../FilterBox'
import Loader from '../Loader'
import {
  useUrlFilters,
  useExplicitlyRemovedFilters,
  useHiddenColumns
} from './hooks'
// import SelectFilter from './filters/SelectFilter'
// import MultiSelectFilter from './filters/MultiSelectFilter'
// import DateFilter from './filters/DateFilter'
// import SeverityFilter from './filters/SeverityFilter'
// import TextFilter from './filters/TextFilter'
import { UrlFilterParser } from './hooks/useUrlFilters'
import { useToggle } from '../../hooks'
import Pagination from './Pagination'

import './table.scss'
import { ExtendedColumnDef, ExtendedColumnDefWithId, TData } from './types'
import { Filter } from './components'

const sortTypes = {
  length: (rowA: Row, rowB: Row, colId: string) => {
    const valALength = rowA.values[colId].length
    const valBLength = rowB.values[colId].length
    if (valALength === valBLength) {
      return 0
    }
    return valALength > valBLength ? 1 : -1
  }
}

export const filterParsersMap = new Map<FilterComponent, UrlFilterParser>()
export const stringParser: UrlFilterParser = (rawValue) => {
  if (Array.isArray(rawValue) && rawValue[0]) {
    return rawValue[0]
  }
  return null
}

const arrayParser: UrlFilterParser = (rawValue) =>
  Array.isArray(rawValue) ? rawValue : null

/* filterParsersMap.set(DateFilter, (rawValue) => {
  if (
    !Utils.isObject(rawValue) ||
    (!rawValue?.startTime?.[0] && !rawValue?.endTime?.[0])
  ) {
    return null
  }

  return {
    startTime: rawValue?.startTime?.[0],
    endTime: rawValue?.endTime?.[0]
  }
}) */

// filterParsersMap.set(MultiSelectFilter, arrayParser)
// filterParsersMap.set(SelectFilter, stringParser)
// filterParsersMap.set(SeverityFilter, (rawValue) =>
//   typeof rawValue === 'string' && SEVERITIES.includes(rawValue)
//     ? rawValue
//     : null
// )
// filterParsersMap.set(TextFilter, stringParser)

export type FilterComponent = unknown
// | typeof DateFilter
// | typeof MultiSelectFilter
// | typeof SelectFilter
// | typeof SeverityFilter
// | typeof TextFilter

export interface RowAction {
  hideAction: boolean | ((original: object) => boolean)
  action?: ((original: object) => void) | (() => void)
  content?: string | ((original: object) => HTMLElement)
  disabled?: boolean | ((original: object) => boolean)
  text?: string
}

export interface CustomRowAction {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  disabled?: boolean | ((original: object) => boolean)
  onClick: ((original: object) => void) | (() => void)
  tooltipText?: any
  extraClass?: string
}

export interface CustomCellProps<Data extends Record<string, unknown>> {
  cell: CellProps<Data>
  column: Column<Data>
}

// export type Column<Data extends Record<string, unknown>> = Omit<
//   RTColumn<Data>,
//   'Filter' | 'Cell' | 'id' | 'accessor'
// > & {
//   // if provided doesn't trigger row click
//   onClickCell?: (values: Data) => void
//   Cell?: React.FC<CustomCellProps<Data>>
//   defaultHidden?: boolean
//   Filter?: FilterComponent
//   filter?:
//     | string
//     | ((
//         rows: Row<Data>[],
//         columnIds: string[],
//         filterValue: any
//       ) => Row<Data>[])
//   sortType?:
//     | 'number'
//     | ((
//         rowA: Row<Data>,
//         rowB: Row<Data>,
//         columnId: string,
//         desc: boolean
//       ) => number)
// } & (
//     | {
//         id?: string
//         accessor: string
//       }
//     | {
//         id: string
//         accessor: (originalRow: Data, rowIndex: number) => unknown
//       }
//   )

export interface ExtendedRow<T extends object>
  extends Row,
    UseExpandedRowProps<T>,
    UseRowStateRowProps<T> {
  subRows: Array<Row<any>>
}

type ExtendedHeaderGroup = HeaderGroup & {
  tooltip?: string
  disableSort?: boolean
  isSortedDesc?: boolean
  Filter?: ReactNode
  isSorted?: boolean
  disableResize?: boolean
}

const ROW_HEIGHT = 52
const ROWS_PER_PAGE_RATIO = 1.5

interface TableProps<Data extends TData> {
  columns: ExtendedColumnDef<Data>[]
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

const columnHelper = createColumnHelper()

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10
  }
]

function Table<Values extends Record<string, unknown>>({
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
}: TableProps<Values>) {
  const columnDefsWithId: ExtendedColumnDefWithId<Values>[] = useMemo(
    () =>
      columns.map((column) => {
        let id = column.id

        column.filterFn

        if (
          !id &&
          'accessorKey' in column &&
          Utils.isString(column.accessorKey)
        ) {
          id = column.accessorKey
        }

        if (!id && Utils.isString(column.header)) {
          id = column.header
        }

        if (!id) {
          throw new Error(
            'Column must have a string id or accessorKey or header'
          )
        }

        return {
          ...column,
          id
        }
      }),
    [columns]
  )

  const extendedInitialUserFilters: ExtendedFilter[] | undefined = useMemo(
    () =>
      initialUserFilters?.map((filter) => ({ ...filter, defaultFilter: true })),
    [initialUserFilters]
  )

  const LSResizing = localStorageService.getItem(SAVED_RESIZED)
  const initialResizing = (LSResizing &&
    JSON.parse(LSResizing)[filterCategory]) || { columnWidths: {} }

  const defaultColumn = React.useMemo(
    () => ({
      // Cell: DefaultCell,
      width: 100,
      sortType: Utils.stringSort
    }),
    []
  )

  const [explicitlyRemovedFilters, updateExplicitlyRemovedFilters] =
    useExplicitlyRemovedFilters(extendedInitialUserFilters)

  const urlFilterConfig = useMemo(
    () =>
      columns.flatMap((col) => {
        const filterParser = filterParsersMap.get(col.Filter)
        const id = col.id ?? col.accessor

        if (!filterParser || typeof id !== 'string') {
          return []
        }

        return {
          id,
          filterParser
        }
      }),
    [columns]
  )

  const [urlFilters, setUrlFilters] = useUrlFilters({
    enabled: addFilterToUrl,
    filterConfig: urlFilterConfig,
    filterCategory
  })
  const [allRowsExpanded, toggleAllRowsExpanding] = useToggle(false)

  const LSEnabledResizing = localStorageService.getItem(SAVED_RESIZING_ENABLED)
  const enabledResizingInLocalStorage =
    LSEnabledResizing &&
    Object.keys(JSON.parse(LSEnabledResizing)).includes(filterCategory)
      ? JSON.parse(LSEnabledResizing)[filterCategory]
      : hasResizableColumns
  const [isResizable, toggleResizable] = useToggle(
    enabledResizingInLocalStorage
  )

  const { current: initialUrlFilters = [] } = useRef(urlFilters)

  const initialFilters = useMemo(() => {
    if (!extendedInitialUserFilters) {
      return initialUrlFilters
    }

    return [...extendedInitialUserFilters]
      .filter(({ id }) => !explicitlyRemovedFilters.has(id))
      .filter(
        ({ id }) => !initialUrlFilters.find((urlFilter) => urlFilter.id === id)
      )
      .concat(initialUrlFilters)
  }, [])

  const pageSize = fixedPageSize || 50

  const { hiddenInLocalStorage, onVisibilityChange } = useHiddenColumns({
    columns: columnDefsWithId,
    filterCategory
  })

  const table = useReactTable(
    {
      columns,
      data,
      initialState: {
        columnVisibility: hiddenInLocalStorage,
        ...(defaultSort && {
          sorting: [{ id: defaultSort, desc: defaultDescendingSort }]
        })
      },
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues()
      // manualPagination,
      // defaultColumn,
      // globalFilter,
      // initialState: {
      //   pageSize,
      //   filters: initialFilters,
      //   globalFilter: defaultGlobalFilter,
      //   hiddenColumns: hiddenInLocalStorage,
      //   groupBy,
      //   columnResizing: initialResizing
      // },
      // autoResetFilters: false,
      // autoResetSortBy: false,
      // autoResetExpanded:
      //   collapseRowsOnLeavingPage && !allRowsExpanded && manualPagination,
      // autoResetPage: false,
      // autoResetRowState: false,
      // autoResetGlobalFilter: false,
      // autoResetHiddenColumns: false,
      // autoResetResize: false,
      // paginateExpandedRows: false,
      // getRowId,
      // sortTypes,
      // manualSortBy: manualSorting,
      // manualFilters
    }
    // useRowState,
    // useFilters,
    // ...(groupBy ? [useGroupBy] : []),
    // useGlobalFilter,
    // useExpanded,
    // useFlexLayout,
    // useResizeColumns
  )
  // // TODO: check when it's updated
  // useEffect(() => {
  //   console.log('table updated')
  // }, [table])

  const {
    pagination: { pageIndex },
    sorting,
    columnFilters,
    columnVisibility
  } = table.getState()

  const allColumns = table.getAllColumns()
  const pageCount = table.getPageCount()
  const isAllRowsExpanded = table.getIsAllRowsExpanded()

  const state = table.getState()

  const rows = table.getRowModel().rows

  const onSortChangedRef = useRef(onSortChanged)
  onSortChangedRef.current = onSortChanged

  useEffect(() => {
    onSortChangedRef.current?.(sorting[0])
  }, [sorting])

  useEffect(() => {
    updateExplicitlyRemovedFilters(columnFilters)
  }, [columnFilters])

  // useEffect(() => {
  //   if (hasResizableColumns) {
  //     localStorageService.updateResized(filterCategory, columnResizing)
  //     Utils.dispatchCustomEvent(COLUMN_RESIZING_LISTENER, undefined)
  //   }
  // }, [JSON.stringify(columnResizing), filterCategory, hasResizableColumns])

  useEffect(() => {
    if (hasResizableColumns) {
      localStorageService.updateResizedEnabled(filterCategory, isResizable)
    }
  }, [isResizable, filterCategory, hasResizableColumns])

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

  const cleanFilters = useMemo(
    () =>
      columnFilters.filter(({ id }) =>
        allColumns.find((column) => id === column.id)
      ),
    [columnFilters]
  )

  interface ExtendedEvent extends Event {
    detail: {
      value: any
      id: any
    }
  }
  function addOrRemoveFromFilter(event: ExtendedEvent) {
    const { value, id } = event.detail
    const findFilter =
      columnFilters.find((filter) => filter.id === id)?.value || []
    const newFilter = Array.isArray(findFilter) ? [...findFilter] : [findFilter]
    if (!newFilter?.includes(value)) {
      newFilter.push(value)
    } else {
      newFilter.splice(newFilter.indexOf(value), 1)
    }
    setFilter(id, Utils.isEmpty(newFilter) ? undefined : newFilter)
  }

  useEffect(() => {
    onFiltersChanged?.(columnFilters)
    if (addFilterToUrl) {
      setUrlFilters(columnFilters)
    }
  }, [columnFilters, addFilterToUrl])

  useEffect(() => {
    // TODO: check that it run only on visibility change
    onVisibilityChange(allColumns, columnVisibility)
  }, [onVisibilityChange, allColumns, columnVisibility])

  useEffect(() => {
    if (listenerPrefix) {
      document.addEventListener(
        `${listenerPrefix}${FILTER_CHANGE_LISTENER}`,
        addOrRemoveFromFilter as EventListener
      )
      Utils.dispatchCustomEvent(
        `${listenerPrefix}${FILTER_LISTENER}`,
        columnFilters
      )
      return () => {
        document.removeEventListener(
          `${listenerPrefix}${FILTER_CHANGE_LISTENER}`,
          addOrRemoveFromFilter as EventListener
        )
      }
    }
    return () => {}
  }, [columnFilters])

  useEffect(() => {
    table.setPageIndex(0)
  }, [pageCount, table])

  useEffect(() => {
    if (!miniTable) {
      tableRef.current?.scrollTo(0, 0)
      if (collapseRowsOnLeavingPage && RowSubComponent && !isAllRowsExpanded) {
        rows.forEach((row) => {
          if (row.isExpanded) {
            row.toggleRowExpanded(false)
          }
        })
      }
    }
  }, [pageIndex, rows])

  useEffect(() => {
    if (fixedPageSize) {
      table.setPageSize(fixedPageSize)
    } else if (miniTable && !fixedPageSize) {
      table.setPageSize(rows.length)
    }
  }, [fixedPageSize, miniTable, rows.length, table])

  useEffect(() => {
    const calcNumberOfRows = _.debounce(() => {
      const tableHeight = tableRef.current?.clientHeight
      if (tableHeight && !miniTable && !fixedPageSize) {
        table.setPageSize(tableHeight / (ROW_HEIGHT / ROWS_PER_PAGE_RATIO))
      }
    }, 350)

    window.addEventListener('resize', calcNumberOfRows)
    return () => {
      window.removeEventListener('resize', calcNumberOfRows)
    }
  }, [fixedPageSize, miniTable, table])

  return (
    <div
      className={clsx(
        'react-table-wrapper-TEMP_NEXT',
        extraClasses?.tableWrapper
      )}
    >
      {!miniTable && (
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
                onClick={table.getToggleAllRowsExpandedHandler()}
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
                  <IconButton onClick={() => table.resetColumnSizing()}>
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
      )}
      {!loading ? (
        <div className={wrapperClasses} ref={tableRef}>
          <table className={tableClass}>
            <thead className='sticky-header'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='table-line'>
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {isExpandable ? (
                    <th className='table-header header-cell-for-expandable' />
                  ) : null}
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort()

                    return (
                      <th
                        colSpan={header.colSpan}
                        key={header.id}
                        className='table-header'
                      >
                        <Tooltip data={header.column.columnDef.meta?.tooltip}>
                          <span
                            className={clsx({
                              ['table-headline']: true,
                              ['disable-sort']: !canSort
                            })}
                            onClick={() => {
                              if (canSort) {
                                table.setSorting((prevSorting) => [
                                  {
                                    id: header.id,
                                    desc:
                                      prevSorting[0]?.id === header.id
                                        ? !prevSorting[0]?.desc
                                        : false
                                  }
                                ])
                              }
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                        </Tooltip>
                        {/* TODO: FILTERING */}
                        {/* {column.Filter ? column.render('Filter') : null} */}
                        {/* {header.column.columnDef.fi && } */}
                        {header.column.columnDef?.meta?.filter && (
                          <Filter column={header.column} />
                        )}
                        {/* {canSort &&
                          (column.isSorted ||
                            (!column.isSorted && !column.Header)) && (
                            <div
                              className={clsx(
                                'table-sort',
                                !column.isSorted &&
                                  !column.Header &&
                                  'table-sort-no-title'
                              )}
                              onClick={() =>
                                toggleSortBy(column.id, !column.isSortedDesc)
                              }
                            >
                              {column.isSortedDesc ? (
                                <LongArrow className='rotate180' />
                              ) : (
                                <LongArrow />
                              )}
                            </div>
                          )} */}
                        {/* {isResizable && !column.disableResize && (
                          <div
                            className={clsx({
                              ['column-resizer']: true,
                              ['column-resizer-is-resizing']: column.isResizing
                            })}
                            {...column.getResizerProps()}
                          />
                        )} */}
                      </th>
                    )
                  })}
                  {/* {!Utils.isEmpty(customRowActions) &&
                    customRowActions.map(({ tooltipText }) => (
                      <th
                        className='table-header table-header-actions'
                        key={tooltipText}
                      >
                        {EMPTY_STRING}
                      </th>
                    ))} */}
                  {(!Utils.isEmpty(rowActions) ||
                    (hasEmptyActionsCell && isResizable)) && (
                    <th className='table-header table-header-actions'>
                      {EMPTY_STRING}
                    </th>
                  )}
                </tr>
              ))}
            </thead>
            <tbody className='table-body'>
              {rows.map((row) => {
                const classes = clsx({
                  'table-line': true,
                  clickable: onRowClick !== NOP || isExpandable,
                  'is-expand': !row.isGrouped && row.isExpanded,
                  'is-selected': checkRowSelected?.(row.original),
                  'is-highlighted': checkRowHighlighted?.(row.original),
                  ...(extraClasses?.tableLine && {
                    [extraClasses.tableLine]: true
                  })
                })

                return (
                  <React.Fragment key={row.id}>
                    <tr className={classes}>
                      {isExpandable && !groupBy && (
                        <td
                          className={clsx(
                            'expand-cell',
                            extraClasses?.expandCell
                          )}
                          onClick={() => {
                            if (RowSubComponent) {
                              row.getToggleRowExpandedProps().onClick()
                            } else if (onRowClick) {
                              onRowClick(row.original)
                            }
                          }}
                        >
                          {row.isExpanded ? (
                            <Arrow />
                          ) : (
                            <Arrow className='rotate270' />
                          )}
                        </td>
                      )}
                      {row.getVisibleCells().map((cell, index) => {
                        const shouldShowAggregated = (() => {
                          if (cell.isAggregated) {
                            return true
                          }

                          if (!groupBy) {
                            return false
                          }

                          const cellGroupIndex = cell.column.groupedIndex
                          const currentGroupIndex = groupBy.indexOf(
                            row.groupByID
                          )

                          return (
                            cellGroupIndex > currentGroupIndex &&
                            cell.row.depth < cellGroupIndex
                          )
                        })()

                        return (
                          <td
                            key={cell.id}
                            className={clsx(
                              'table-cell',
                              extraClasses?.tableCell
                            )}
                            onClick={() => {
                              if (row.isGrouped) {
                                row.toggleRowExpanded()
                              } else {
                                const onClickCell = columns[index]?.onClickCell

                                if (onClickCell) {
                                  onClickCell(row.original)
                                } else if (RowSubComponent) {
                                  row.getToggleRowExpandedProps().onClick()
                                } else if (onRowClick) {
                                  onRowClick(row.original)
                                }
                              }
                            }}
                          >
                            {cell.isGrouped ? (
                              <>
                                <span className='expand-cell expand-group'>
                                  {row.isExpanded ? (
                                    <Arrow />
                                  ) : (
                                    <Arrow className='rotate270' />
                                  )}
                                </span>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </>
                            ) : shouldShowAggregated ? (
                              cell.render('Aggregated')
                            ) : cell.isPlaceholder ? null : (
                              <>
                                {groupBy &&
                                  RowSubComponent &&
                                  !row.isGrouped &&
                                  (index === 0 ||
                                    row.getVisibleCells()[index - 1]
                                      .isPlaceholder) && (
                                    <span className='expand-cell expand-group'>
                                      {row.isExpanded ? (
                                        <Arrow />
                                      ) : (
                                        <Arrow className='rotate270' />
                                      )}
                                    </span>
                                  )}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </>
                            )}
                          </td>
                        )
                      })}
                      {!Utils.isEmpty(customRowActions) &&
                        customRowActions.map((action) => (
                          <td className='td-actions' key={action.tooltipText}>
                            {/* <IconButtonCell row={extendedRow} action={action} /> */}
                          </td>
                        ))}
                      {(!Utils.isEmpty(rowActions) ||
                        (hasEmptyActionsCell && isResizable)) && (
                        <td className='td-actions'>
                          {/* <ActionsCell
                            row={extendedRow}
                            actions={rowActions}
                            disablePortal={disableActionsPortal}
                          /> */}
                        </td>
                      )}
                    </tr>
                    {row.isExpanded && !row.isGrouped && RowSubComponent ? (
                      <tr className='sub-table-line'>
                        <td>
                          <RowSubComponent row={row} />
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
          {!rows.length && (
            <span className='empty-message'>
              {emptyMessage || (title ? `No ${title}` : `No ${rows}`)}
            </span>
          )}
        </div>
      ) : (
        <Loader />
      )}
      {(!miniTable || fixedPageSize) && !manualPagination && (
        <div className='footer'>
          <Pagination
            onPageChange={(pageNumber) => table.setPageIndex(pageNumber - 1)}
            numberOfPages={pageCount}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(Table)
