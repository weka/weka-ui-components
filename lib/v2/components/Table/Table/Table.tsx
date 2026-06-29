import type { CustomFilters } from '../FilterPopover'
import type { ActiveFilter } from '../filterUtils'
import type { RowAction } from './rowActions'
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeMode,
  SortingState,
  Table as TanstackTable,
  TableOptions,
  VisibilityState
} from '@tanstack/react-table'
import type { CSSProperties, ReactNode } from 'react'

import { useEffect, useMemo, useRef, useState } from 'react'
import { flexRender, useReactTable } from '@tanstack/react-table'
import clsx from 'clsx'

import { EMPTY_STRING } from '#consts'
import { NOOP } from '#v2/utils/consts'

import { Pagination } from '../Pagination'
import { RowActionsCell } from '../RowActionsCell'
import { TableFilter } from '../TableFilter'
import {
  buildTableColumns,
  getAutoFlexColumnId,
  getCanShowFilter,
  isColumnFlexOrAuto
} from '../tableUtils'
import { useColumnVisibility } from './hooks/useColumnVisibility'
import { useGlobalSearch } from './hooks/useGlobalSearch'
import { useInitialSorting } from './hooks/useInitialSorting'
import { usePaginationState } from './hooks/usePaginationState'
import { useScrollToRow } from './hooks/useScrollToRow'
import { useTableOptions } from './hooks/useTableOptions'
import { renderTableBody } from './renderTableBody'
import { TableContent } from './TableContent'
import { TableHeaderSection } from './TableHeaderSection'

import styles from './table.module.scss'

const DEFAULT_PAGE_SIZE = 25
const MAX_ROWS_FOR_COMPACT = 10
const FIRST_PAGE = 1
const COMPACT_HALF_DIVISOR = 2
const ROW_ACTIONS_COLUMN_SIZE = 56

const EMPTY_ACTIVE_FILTERS: ActiveFilter[] = []
const EMPTY_EXCLUDED_FIELDS: string[] = []

export type SortDirection = 'asc' | 'desc'

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface TableProps<TData = unknown> {
  data: TData[]
  columns: ColumnDef<TData>[]
  loading?: boolean
  isFetching?: boolean | null

  onRowClick?: (row: TData) => void
  activeRowId?: string | number
  getRowId?: (row: TData) => string | number | null | undefined
  scrollToRowId?: string | number | null

  activeFilters?: ActiveFilter[]
  onFiltersChange?: (filters: ActiveFilter[]) => void
  searchExcludedFields?: string[]
  customFilters?: CustomFilters

  initialColumnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void

  hasResizableColumns?: boolean
  emptyMessage?: string
  maxHeight?: string | number
  showFilterChips?: boolean
  showSearch?: boolean

  manualPagination?: boolean
  itemsAmount?: number
  fixedPageSize?: number
  pageSize?: number
  currentPage?: number
  onPaginationChange?: (pagination: PaginationState) => void
  isPaginationPageEnabled?: (page: number) => boolean

  title?: string
  customTitle?: ReactNode
  useTableHeader?: boolean
  tableHeaderActions?: ReactNode
  tableActions?: ReactNode

  defaultSortColumn?: string
  defaultSortDirection?: SortDirection
  manualSorting?: boolean
  onExternalSortingChange?: (sorting: SortingState) => void
  onResetColumnSizing?: () => void

  onFilteredDataChange?: (filteredData: TData[]) => void
  onGlobalSearch?: (searchTerm: string) => void
  onTableReady?: (table: TanstackTable<TData>) => void

  csvFileTitle?: string
  getCsvData?: () => Promise<readonly TData[]>
  onCsvError?: (message: string) => void
  dataTestId?: string
  rowActions?: RowAction<TData>[]
  pinFirstColumn?: boolean
  drawer?: ReactNode
  drawerOpen?: boolean
  drawerWidth?: number
  framed?: boolean
  rowActionsWidth?: number
}

export const ROW_ACTIONS_COLUMN_ID = '__rowActions__'

const COLUMN_RESIZE_MODE: ColumnResizeMode = 'onChange'

const SCROLLBAR_GUTTER_VAR = '--scrollbar-gutter'

export function Table<TData = unknown>({
  data,
  columns,
  loading,
  isFetching,
  onRowClick,
  hasResizableColumns = true,
  emptyMessage = 'No data',
  maxHeight,
  manualPagination,
  itemsAmount,
  fixedPageSize,
  onPaginationChange,
  pageSize = DEFAULT_PAGE_SIZE,
  title,
  customTitle,
  showFilterChips = true,
  showSearch = false,
  tableHeaderActions,
  tableActions,
  useTableHeader = true,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  manualSorting,
  onResetColumnSizing,
  onGlobalSearch,
  searchExcludedFields = EMPTY_EXCLUDED_FIELDS,
  activeRowId,
  getRowId,
  scrollToRowId,
  onFilteredDataChange,
  onExternalSortingChange,
  onTableReady,
  csvFileTitle,
  getCsvData,
  onCsvError,
  dataTestId,
  activeFilters = EMPTY_ACTIVE_FILTERS,
  onFiltersChange,
  customFilters,
  initialColumnVisibility,
  onColumnVisibilityChange,
  currentPage: currentPageProp,
  isPaginationPageEnabled,
  rowActions,
  pinFirstColumn = false,
  drawer,
  drawerOpen = false,
  drawerWidth = 0,
  framed = false,
  rowActionsWidth = ROW_ACTIONS_COLUMN_SIZE
}: Readonly<TableProps<TData>>) {
  const { columnVisibility, handleColumnVisibilityChange } =
    useColumnVisibility({
      columns,
      initialColumnVisibility,
      onColumnVisibilityChange
    })

  const { sorting, setSorting } = useInitialSorting(
    defaultSortColumn,
    defaultSortDirection,
    columns
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { filteredData, globalSearchTerm, handleGlobalSearch } =
    useGlobalSearch(data, columns, searchExcludedFields)

  const effectivePageSize = fixedPageSize || pageSize

  const {
    currentPage,
    setCurrentPage,
    setInternalCurrentPage,
    handlePageChange
  } = usePaginationState(
    manualPagination,
    currentPageProp,
    onPaginationChange,
    effectivePageSize
  )

  const setActiveFilters = onFiltersChange ?? NOOP

  useEffect(() => {
    const newColumnFilters = activeFilters.map((filter) => ({
      id: filter.columnId,
      value: filter.value
    }))
    setColumnFilters(newColumnFilters)
  }, [activeFilters])

  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const handleBodyScroll = () => {
    if (headerRef.current && bodyRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft
    }
  }

  const handleGlobalSearchWithEffects = (searchTerm: string) => {
    handleGlobalSearch(searchTerm)
    if (!manualPagination) {
      setInternalCurrentPage(FIRST_PAGE)
    }
    onGlobalSearch?.(searchTerm)
  }

  const displayData = useMemo(
    () => (globalSearchTerm ? filteredData : data),
    [data, filteredData, globalSearchTerm]
  )

  useEffect(() => {
    const bodyEl = bodyRef.current
    const headerEl = headerRef.current
    if (!bodyEl || !headerEl) {
      return
    }

    const syncScrollbarGutter = () => {
      const scrollbarWidth = bodyEl.offsetWidth - bodyEl.clientWidth
      headerEl.style.setProperty(
        SCROLLBAR_GUTTER_VAR,
        `${scrollbarWidth}px`
      )
    }

    syncScrollbarGutter()

    const observer = new ResizeObserver(syncScrollbarGutter)
    observer.observe(bodyEl)

    return () => observer.disconnect()
  }, [loading, displayData, columnVisibility, drawerOpen, drawerWidth])

  const tableColumns = useMemo(() => {
    const builtColumns = buildTableColumns(columns, hasResizableColumns)
    if (!rowActions || rowActions.length === 0) {
      return builtColumns
    }
    const rowActionsColumn: ColumnDef<TData> = {
      id: ROW_ACTIONS_COLUMN_ID,
      header: EMPTY_STRING,
      enableSorting: false,
      enableColumnFilter: false,
      enableResizing: false,
      enableHiding: false,
      size: rowActionsWidth,
      minSize: rowActionsWidth,
      meta: { rowActions } as Record<string, unknown>,
      cell: (ctx) => <RowActionsCell {...ctx} />
    }
    return [...builtColumns, rowActionsColumn]
  }, [columns, hasResizableColumns, rowActions, rowActionsWidth])

  const tableOptions = useTableOptions({
    displayData,
    tableColumns,
    columnResizeMode: COLUMN_RESIZE_MODE,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    handleColumnVisibilityChange,
    hasResizableColumns,
    currentPage,
    effectivePageSize,
    manualPagination,
    manualSorting
  })

  const table = useReactTable(tableOptions as TableOptions<TData>)

  const filteredRowCount = table.getFilteredRowModel().rows.length

  const totalItems = useMemo(() => {
    if (manualPagination) {
      return itemsAmount || 0
    }
    return filteredRowCount
  }, [manualPagination, itemsAmount, filteredRowCount])

  const totalPages = Math.ceil(totalItems / effectivePageSize)
  const showPagination = totalPages > 1

  useEffect(() => {
    if (!manualPagination && (totalPages === 0 || currentPage > totalPages)) {
      setInternalCurrentPage(FIRST_PAGE)
    }
  }, [totalPages, currentPage, manualPagination, setInternalCurrentPage])

  useEffect(() => {
    if (onTableReady) {
      onTableReady(table)
    }
  }, [onTableReady, table])

  useScrollToRow({
    scrollToRowId,
    manualPagination,
    table,
    getRowId,
    effectivePageSize,
    currentPage,
    setInternalCurrentPage,
    data
  })

  const actualFilteredCount = useMemo(() => {
    if (manualPagination) {
      return itemsAmount || 0
    }
    if (activeFilters.length === 0) {
      return itemsAmount || data.length
    }
    return filteredRowCount
  }, [
    manualPagination,
    itemsAmount,
    data.length,
    activeFilters,
    filteredRowCount
  ])

  const visibleRowCount = table.getRowModel().rows.length

  const isCompactTable = useMemo(() => {
    if (loading || maxHeight || visibleRowCount === 0) {
      return false
    }

    if (manualPagination) {
      const halfPageSizeThreshold = effectivePageSize / COMPACT_HALF_DIVISOR
      return (
        visibleRowCount <
          Math.min(MAX_ROWS_FOR_COMPACT, halfPageSizeThreshold) &&
        !showPagination
      )
    }

    return visibleRowCount <= MAX_ROWS_FOR_COMPACT
  }, [
    visibleRowCount,
    maxHeight,
    manualPagination,
    loading,
    effectivePageSize,
    showPagination
  ])

  useEffect(() => {
    if (!onFilteredDataChange) {
      return
    }
    try {
      const filteredRows = table.getFilteredRowModel().rows
      onFilteredDataChange(filteredRows.map((row) => row.original))
    } catch {
      onFilteredDataChange(data)
    }
  }, [onFilteredDataChange, table, data, columnFilters])

  useEffect(() => {
    onExternalSortingChange?.(sorting)
  }, [onExternalSortingChange, sorting])

  useEffect(() => {
    setCurrentPage(FIRST_PAGE)
  }, [activeFilters, globalSearchTerm, setCurrentPage])

  const firstDataColumnId = pinFirstColumn
    ? table
        .getVisibleLeafColumns()
        .find((col) => col.id !== ROW_ACTIONS_COLUMN_ID)?.id
    : undefined

  const dataColumns = table
    .getVisibleLeafColumns()
    .filter((col) => col.id !== ROW_ACTIONS_COLUMN_ID)
  const autoFlexColumnId = getAutoFlexColumnId(dataColumns, rowActions)

  const isColumnFlex = (column: Column<TData, unknown>) =>
    isColumnFlexOrAuto(column, autoFlexColumnId)

  const totalColumnsWidth = table
    .getVisibleLeafColumns()
    .reduce((sum, col) => sum + col.getSize(), 0)

  const wrapperStyle = maxHeight
    ? {
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
      }
    : undefined

  if (loading) {
    return (
      <div
        className={styles.customTableWrapper}
        style={wrapperStyle}
      >
        <div className={styles.loadingState}>Loading...</div>
      </div>
    )
  }

  const handleResetColumnSizing = () => {
    table.getAllColumns().forEach((column) => column.resetSize())
    onResetColumnSizing?.()
  }

  const handleRemoveFilter = (columnId: string) => {
    table.getColumn(columnId)?.setFilterValue(undefined)
    setActiveFilters(
      activeFilters.filter((filter) => filter.columnId !== columnId)
    )
  }

  const handleClearAllFilters = () => {
    table.getAllColumns().forEach((column) => {
      if (column.getCanFilter()) {
        column.setFilterValue(undefined)
      }
    })
    setActiveFilters([])
  }

  return (
    <div
      style={wrapperStyle}
      className={clsx(
        styles.customTableWrapper,
        isCompactTable && styles.compactTable,
        isFetching && styles.fetching
      )}
    >
      <TableHeaderSection
        activeFilters={activeFilters}
        actualFilteredCount={actualFilteredCount}
        columns={columns}
        csvFileTitle={csvFileTitle}
        customFilters={customFilters}
        customTitle={customTitle}
        data={data}
        getCsvData={getCsvData}
        onClearAllFilters={handleClearAllFilters}
        onCsvError={onCsvError}
        onFilterChange={setActiveFilters}
        onGlobalSearch={handleGlobalSearchWithEffects}
        onRemoveFilter={handleRemoveFilter}
        onResetColumnSizing={handleResetColumnSizing}
        showFilterChips={showFilterChips}
        showSearch={showSearch}
        table={table}
        tableActions={tableActions}
        tableHeaderActions={tableHeaderActions}
        title={title}
        useTableHeader={useTableHeader}
      />
      {renderTableBody({
        drawer,
        drawerOpen,
        drawerWidth,
        framed,
        footer: (
          <div className={styles.tableFooter}>
            {showPagination ? (
              <Pagination
                currentPage={currentPage}
                isPageEnabled={isPaginationPageEnabled}
                onPageChange={handlePageChange}
                totalPages={Math.max(totalPages, FIRST_PAGE)}
              />
            ) : null}
          </div>
        ),
        tableContainerContent: (
          <div className={styles.tableScrollContainer}>
            <div
              ref={headerRef}
              className={styles.tableHeaderWrapper}
            >
              <table
                className={styles.table}
                style={{ minWidth: totalColumnsWidth }}
              >
                <thead className={styles.tableHeader}>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers
                        .filter((header) => header.column.getIsVisible())
                        .map((header) => {
                          const columnId = header.column.id || header.id
                          const isActionsColumn =
                            header.column.id === ROW_ACTIONS_COLUMN_ID
                          const isFirstColumn =
                            header.column.id === firstDataColumnId
                          const isFlexColumn = isColumnFlex(header.column)
                          return (
                            <th
                              key={header.id}
                              data-testid={`column-header-${columnId}`}
                              className={clsx(styles.headerCell, {
                                [styles.stickyActions]: isActionsColumn,
                                [styles.stickyFirst]: isFirstColumn
                              })}
                              style={{
                                width: isFlexColumn
                                  ? undefined
                                  : header.getSize()
                              }}
                            >
                              <div className={styles.headerContent}>
                                <div className={styles.headerMain}>
                                  <div
                                    onClick={header.column.getToggleSortingHandler()}
                                    className={
                                      header.column.getCanSort()
                                        ? styles.sortableHeader
                                        : styles.headerText
                                    }
                                  >
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                  </div>
                                  <div className={styles.headerIcons}>
                                    {(getCanShowFilter(header) ||
                                      header.column.getCanSort()) && (
                                      <TableFilter
                                        activeFilters={activeFilters}
                                        canFilter={getCanShowFilter(header)}
                                        canSort={header.column.getCanSort()}
                                        columnId={header.column.id}
                                        columns={columns}
                                        customFilters={customFilters}
                                        onFilterChange={setActiveFilters}
                                        onSortClick={header.column.getToggleSortingHandler()}
                                        sortDirection={header.column.getIsSorted()}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                              {hasResizableColumns &&
                              header.column.getCanResize() ? (
                                <div
                                  className={styles.resizer}
                                  data-testid={`column-resizer-${columnId}`}
                                  onMouseDown={header.getResizeHandler()}
                                  onTouchStart={header.getResizeHandler()}
                                />
                              ) : null}
                            </th>
                          )
                        })}
                    </tr>
                  ))}
                </thead>
              </table>
            </div>
            <div
              ref={bodyRef}
              className={styles.tableWrapper}
              onScroll={handleBodyScroll}
            >
              <table
                className={styles.table}
                data-testid={dataTestId}
                style={{ minWidth: totalColumnsWidth }}
              >
                <tbody className={styles.tableBody}>
                  <TableContent
                    activeRowId={activeRowId}
                    emptyMessage={emptyMessage}
                    getRowId={getRowId}
                    onRowClick={onRowClick}
                    rows={table.getRowModel().rows}
                    renderCell={(cell) => {
                      const cellMeta = cell.column.columnDef.meta as
                        | { cellStyle?: CSSProperties }
                        | undefined
                      const cellStyle = cellMeta?.cellStyle || {}
                      const isActionsCell =
                        cell.column.id === ROW_ACTIONS_COLUMN_ID
                      const isFirstCell = cell.column.id === firstDataColumnId
                      const cellWidth = isColumnFlex(cell.column)
                        ? undefined
                        : cell.column.getSize()

                      return (
                        <td
                          key={cell.id}
                          style={{ width: cellWidth, ...cellStyle }}
                          className={clsx(styles.tableCell, {
                            [styles.stickyActions]: isActionsCell,
                            [styles.stickyFirst]: isFirstCell
                          })}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    }}
                  />
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
