import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  COLUMN_RESIZING_LISTENER,
  EMPTY_STRING,
  NOP,
  SAVED_RESIZED,
  SAVED_RESIZING_ENABLED
} from 'consts'
import clsx from 'clsx'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getFacetedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  ColumnFilter,
  FilterFn
} from '@tanstack/react-table'
import Utils from 'utils'
import localStorageService from '../../localStorageService'
import Loader from '../Loader'
import {
  useUrlFilters,
  useExplicitlyRemovedFilters,
  useHiddenColumns,
  usePageSize,
  usePrepareColumnDefs,
  useFiltersChangeListener,
  useColumnSizeVars,
  useResetPagination
} from './hooks'
import { useToggle } from 'hooks'
import {
  ExtendedColumnFilter,
  ExtendedColumnDef,
  RowAction,
  TableExtraClasses,
  ExtendedRow
} from './types'
import { ColumnHeader, Pagination, TableTop, TableBody } from './components'
import { AggregatedTotalCell, DefaultCell } from './exports'
import { TABLE_FILTERS_MAP } from './tableConsts'
import { getCustomSortingFns, clearUniqueCountCache } from './tableUtils'

import './table.scss'

export interface TableProps<Data, Value> {
  columns: ExtendedColumnDef<Data, Value>[]
  data: Data[]
  filterCategory: string
  title?: string
  maxRows?: number
  rowActions?: RowAction<Data>[]
  emptyMessage?: string
  tableActions?: Array<ReactNode>
  defaultSort?: string
  globalFilter?: any
  globalFilterFn?: FilterFn<Data>
  defaultGlobalFilter?: string
  checkRowSelected?: (row: object) => boolean
  checkRowHighlighted?: (row: object) => boolean
  getRowId?: (
    originalRow: Data,
    index: number,
    parent?: ExtendedRow<Data>
  ) => string
  addFilterToUrl?: boolean
  RowSubComponent?: React.FC<{ row: any }>
  listenerPrefix?: string
  onRowClick?: (values?: Data) => void
  onToggleExpand?: (row: ExtendedRow<Data>) => void
  miniTable?: boolean
  fixedPageSize?: number
  disableActionsPortal?: boolean
  manualPagination?: boolean
  currentPage?: number
  onPageChange?: (page: number) => void
  totalRows?: number
  rowsPerPage?: number
  disablePageInput?: boolean
  canExpandAll?: boolean
  getRowCanExpand?: (row: Data) => boolean
  expandedRows?: Record<string, boolean>
  loading?: boolean
  filters: ExtendedColumnFilter[]
  onFiltersChanged?: (newFilters: ExtendedColumnFilter[]) => void
  defaultDescendingSort?: boolean
  manualFilters?: boolean
  initialFilters?: ColumnFilter[]
  extraClasses?: TableExtraClasses
  /**
   * Must be memoized
   */
  grouping?: string[]
  hasCustomDateFormat?: boolean
  customDateFormat?: string
  hasResizableColumns?: boolean
  hasEmptyActionsCell?: boolean
  collapseRowsOnLeavingPage?: boolean
  onSortChanged?: (sort: { id: string; desc?: boolean }) => void
  manualSorting?: boolean
  infinityScrollConfig?: {
    hasNextPage: boolean
    fetchNextPage: () => void
    isFetchingNextPage: boolean
  }
  hideRowsCount?: boolean
  /**
   * Required to reset pagination when filters are changed outside of the table.
   * Must be memoized
   */
  outsideFilters?: unknown
}

function Table<Data, Value>(props: TableProps<Data, Value>) {
  const {
    columns: rawColumnDefs,
    data,
    rowActions = [],
    tableActions,
    title,
    defaultSort = EMPTY_STRING,
    globalFilter,
    globalFilterFn,
    defaultGlobalFilter = EMPTY_STRING,
    checkRowSelected,
    checkRowHighlighted,
    getRowId,
    addFilterToUrl,
    RowSubComponent,
    listenerPrefix,
    onRowClick = NOP,
    onToggleExpand,
    miniTable,
    filterCategory,
    fixedPageSize,
    disableActionsPortal,
    maxRows,
    emptyMessage,
    manualPagination,
    currentPage: outerCurrentPage,
    onPageChange: outerPageChange,
    totalRows,
    rowsPerPage,
    disablePageInput,
    canExpandAll = false,
    loading,
    filters: userColumnFilters,
    onFiltersChanged,
    defaultDescendingSort = false,
    onSortChanged,
    manualSorting,
    manualFilters,
    extraClasses,
    initialFilters: initialUserFilters,
    grouping,
    hasCustomDateFormat,
    customDateFormat,
    hasResizableColumns = false,
    hasEmptyActionsCell = false,
    collapseRowsOnLeavingPage = false,
    getRowCanExpand,
    expandedRows,
    infinityScrollConfig,
    hideRowsCount = false,
    outsideFilters
  } = props

  const columnDefs = usePrepareColumnDefs({
    columnDefs: rawColumnDefs
  })

  const extendedInitialUserFilters: ExtendedColumnFilter[] | undefined =
    useMemo(
      () =>
        initialUserFilters?.map((filter) => ({
          ...filter,
          defaultFilter: true
        })),
      [initialUserFilters]
    )

  const LSResizing = localStorageService.getItem(SAVED_RESIZED)
  const initialResizing = (LSResizing &&
    JSON.parse(LSResizing)[filterCategory]) || { columnWidths: {} }

  const [explicitlyRemovedFilters, updateExplicitlyRemovedFilters] =
    useExplicitlyRemovedFilters(extendedInitialUserFilters)

  const urlFiltersConfig = useMemo(
    () =>
      columnDefs.flatMap((columnDef) => {
        const filterDef = columnDef.meta?.filter

        if (!filterDef) {
          return []
        }

        const filterType =
          typeof filterDef === 'string' ? filterDef : filterDef.type

        const filterParser = TABLE_FILTERS_MAP[filterType].parser

        return {
          id: columnDef.id,
          filterParser
        }
      }),
    [columnDefs]
  )

  const [urlFilters, setUrlFilters] = useUrlFilters({
    enabled: addFilterToUrl,
    filterConfig: urlFiltersConfig,
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
  }, [explicitlyRemovedFilters, extendedInitialUserFilters, initialUrlFilters])

  const { hiddenInLocalStorage, onVisibilityChange } = useHiddenColumns<
    Data,
    Value
  >({
    columns: columnDefs,
    filterCategory
  })

  const [paginationState, setPaginationState] = useState({
    pageIndex: outerCurrentPage ? outerCurrentPage - 1 : 0,
    pageSize: fixedPageSize || 50
  })

  const table = useReactTable<Data>({
    columns: columnDefs,
    data,
    manualSorting,
    manualFiltering: manualFilters,
    initialState: {
      columnVisibility: hiddenInLocalStorage,
      columnSizing: initialResizing,
      grouping,
      ...(defaultSort && {
        sorting: [{ id: defaultSort, desc: defaultDescendingSort }]
      }),
      columnFilters: initialFilters,
      globalFilter: defaultGlobalFilter
    },
    state: {
      pagination: infinityScrollConfig
        ? {
            pageSize: data.length,
            pageIndex: 0
          }
        : {
            pageSize: fixedPageSize || paginationState.pageSize,
            pageIndex: outerCurrentPage
              ? outerCurrentPage - 1
              : paginationState.pageIndex
          },
      ...(userColumnFilters && { columnFilters: userColumnFilters })
    },
    ...(userColumnFilters && { onColumnFiltersChange: onFiltersChanged }),
    defaultColumn: {
      cell: DefaultCell,
      aggregatedCell: AggregatedTotalCell,
      size: 100,
      sortingFn: 'stringSort'
    },
    sortingFns: getCustomSortingFns(grouping),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    enableColumnResizing: isResizable,
    columnResizeMode: 'onChange',
    getRowCanExpand: () => isExpandable,
    autoResetExpanded:
      collapseRowsOnLeavingPage && !allRowsExpanded && manualPagination,
    autoResetPageIndex: false,
    autoResetPage: false,
    paginateExpandedRows: false,
    getRowId,
    manualPagination,
    onPaginationChange: setPaginationState,
    ...(manualPagination &&
      totalRows &&
      rowsPerPage && { pageCount: Math.ceil(totalRows / rowsPerPage) }),
    ...(grouping && { getGroupedRowModel: getGroupedRowModel() })
  })

  table.setOptions((prev) => ({
    ...prev,
    globalFilterFn: globalFilterFn ?? prev.globalFilterFn,
    state: {
      ...prev.state,
      globalFilter: globalFilter ?? prev.state.globalFilter
    }
  }))

  const {
    pagination: { pageIndex },
    columnFilters,
    columnVisibility,
    columnSizing,
    sorting
  } = table.getState()

  const allColumns = table.getAllColumns()
  const pageCount = table.getPageCount()
  const isAllRowsExpanded = table.getIsAllRowsExpanded()

  const { rows } = table.getRowModel()

  const onSortChangedRef = useRef(onSortChanged)
  onSortChangedRef.current = onSortChanged

  useEffect(() => {
    onSortChangedRef.current?.(sorting[0])
  }, [sorting])

  useEffect(() => {
    updateExplicitlyRemovedFilters(columnFilters)
  }, [columnFilters])

  useEffect(() => {
    if (hasResizableColumns) {
      localStorageService.updateResized(filterCategory, columnSizing)
      Utils.dispatchCustomEvent(COLUMN_RESIZING_LISTENER, undefined)
    }
  }, [columnSizing, filterCategory, hasResizableColumns])

  useEffect(() => {
    if (hasResizableColumns) {
      localStorageService.updateResizedEnabled(filterCategory, isResizable)
    }
  }, [isResizable, filterCategory, hasResizableColumns])

  const tableRef = useRef<HTMLDivElement>(null)
  const isExpandable = !!RowSubComponent

  useEffect(() => {
    if (!userColumnFilters) {
      onFiltersChanged?.(columnFilters)
    }
    if (addFilterToUrl) {
      setUrlFilters(columnFilters)
    }
  }, [columnFilters, addFilterToUrl])

  useEffect(() => {
    onVisibilityChange(allColumns, columnVisibility)
  }, [onVisibilityChange, allColumns, columnVisibility])

  useEffect(() => {
    if (typeof paginationState.pageIndex === 'number') {
      outerPageChange?.(paginationState.pageIndex + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationState.pageIndex])

  useEffect(() => {
    clearUniqueCountCache()
  }, [data])

  useLayoutEffect(() => {
    if (!miniTable) {
      tableRef.current?.scrollTo(0, 0)
      if (collapseRowsOnLeavingPage && RowSubComponent && !isAllRowsExpanded) {
        table.toggleAllRowsExpanded(false)
      }
    }
  }, [
    paginationState.pageIndex,
    RowSubComponent,
    collapseRowsOnLeavingPage,
    isAllRowsExpanded,
    miniTable,
    table
  ])

  useFiltersChangeListener({
    columnFilters,
    table,
    listenerPrefix
  })

  usePageSize<Data>({ table, tableRef, miniTable, fixedPageSize, data })

  useResetPagination({
    table,
    columnFilters,
    manualPagination,
    sorting,
    scrollElement: tableRef.current,
    outsideFilters
  })

  const columnSizeVars = useColumnSizeVars({ table })

  return (
    <div className={clsx('react-table-wrapper', extraClasses?.tableWrapper)}>
      {!miniTable && (
        <TableTop
          title={title}
          totalRows={totalRows}
          maxRows={maxRows}
          table={table}
          canExpandAll={canExpandAll}
          isExpandable={isExpandable}
          tableActions={tableActions}
          hasResizableColumns={hasResizableColumns}
          isResizable={isResizable}
          toggleResizable={toggleResizable}
          hasCustomDateFormat={hasCustomDateFormat}
          customDateFormat={customDateFormat}
          toggleAllRowsExpanding={toggleAllRowsExpanding}
          hideRowsCount={hideRowsCount}
        />
      )}
      {!loading ? (
        <div
          className={clsx({
            'mini-table': miniTable,
            'scroll-wrapper': true
          })}
          ref={tableRef}
        >
          <table
            className={clsx('react-table', {
              'empty-table': !rows.length
            })}
            style={columnSizeVars}
          >
            <thead className='sticky-header'>
              {table.getHeaderGroups().map((headerGroup) => (
                <ColumnHeader
                  key={headerGroup.id}
                  headerGroup={headerGroup}
                  table={table}
                  isExpandable={isExpandable}
                  rowActions={rowActions}
                  hasEmptyActionsCell={hasEmptyActionsCell}
                  isResizable={isResizable}
                  scrollElement={tableRef.current}
                  showScrollToTop={!!infinityScrollConfig}
                />
              ))}
            </thead>
            <TableBody
              table={table}
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
              getRowCanExpand={getRowCanExpand}
              expandedRows={expandedRows}
              infinityScrollConfig={infinityScrollConfig}
              tableRef={tableRef}
              rows={rows}
            />
          </table>
          {!rows.length && (
            <span className='empty-message'>
              {emptyMessage || (title ? `No ${title}` : `No ${rows}`)}
            </span>
          )}
          {infinityScrollConfig?.isFetchingNextPage && (
            <div className='fetching-page-loader'>
              <Loader />
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
      {(!miniTable || fixedPageSize) && !infinityScrollConfig && !loading && (
        <div className='footer'>
          <Pagination
            currentPage={pageIndex + 1}
            onPageChange={(pageNumber) => {
              table.setPageIndex(pageNumber - 1)
            }}
            numberOfPages={pageCount}
            disablePageInput={disablePageInput}
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(Table)
