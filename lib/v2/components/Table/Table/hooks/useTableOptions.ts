import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeMode,
  ExpandedState,
  GroupingState,
  OnChangeFn,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'

import { useMemo } from 'react'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import { AggregatedCountCell } from '../../AggregatedCountCell'
import { DefaultCell } from '../../DefaultCell'

const DEFAULT_COLUMN_SIZE = 150
const MIN_COLUMN_SIZE = 50
const MAX_COLUMN_SIZE = 500
const FIRST_PAGE = 1
const MANUAL_PAGE_COUNT = -1

interface UseTableOptionsParams<TData> {
  displayData: TData[]
  tableColumns: ColumnDef<TData>[]
  sorting: SortingState
  setSorting: OnChangeFn<SortingState>
  columnFilters: ColumnFiltersState
  setColumnFilters: OnChangeFn<ColumnFiltersState>
  columnVisibility: VisibilityState
  handleColumnVisibilityChange: OnChangeFn<VisibilityState>
  columnResizeMode: ColumnResizeMode
  hasResizableColumns: boolean
  currentPage: number
  effectivePageSize: number
  manualPagination: boolean | undefined
  manualFiltering?: boolean
  manualSorting?: boolean
  grouping: GroupingState
  expanded: ExpandedState
  setExpanded: OnChangeFn<ExpandedState>
  endless: boolean
}

/**
 * Builds the memoized TanStack table options, wiring sorting, filtering,
 * column visibility, resizing, grouping, and either client-side or manual
 * pagination.
 */
export function useTableOptions<TData>({
  displayData,
  tableColumns,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  columnVisibility,
  handleColumnVisibilityChange,
  columnResizeMode,
  hasResizableColumns,
  currentPage,
  effectivePageSize,
  manualPagination,
  manualFiltering,
  manualSorting,
  grouping,
  expanded,
  setExpanded,
  endless
}: UseTableOptionsParams<TData>) {
  return useMemo(() => {
    const isGrouped = grouping.length > 0

    const baseOptions = {
      data: displayData,
      columns: tableColumns,
      enableColumnResizing: hasResizableColumns,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        pagination: {
          pageIndex: currentPage - FIRST_PAGE,
          pageSize: effectivePageSize
        },
        ...(isGrouped && { grouping, expanded })
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      defaultColumn: {
        size: DEFAULT_COLUMN_SIZE,
        minSize: MIN_COLUMN_SIZE,
        maxSize: MAX_COLUMN_SIZE,
        cell: DefaultCell as ColumnDef<TData>['cell'],
        aggregatedCell:
          AggregatedCountCell as ColumnDef<TData>['aggregatedCell']
      },
      getCoreRowModel: getCoreRowModel(),
      ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
      getFilteredRowModel: getFilteredRowModel(),
      ...(isGrouped && {
        getGroupedRowModel: getGroupedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        autoResetExpanded: false,
        paginateExpandedRows: Boolean(manualPagination) || endless
      }),
      columnResizeMode,
      manualFiltering,
      manualSorting
    }

    if (manualPagination) {
      return {
        ...baseOptions,
        manualPagination: true,
        pageCount: MANUAL_PAGE_COUNT
      }
    }

    return {
      ...baseOptions,
      getPaginationRowModel: getPaginationRowModel()
    }
  }, [
    displayData,
    tableColumns,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    handleColumnVisibilityChange,
    columnResizeMode,
    hasResizableColumns,
    currentPage,
    effectivePageSize,
    manualPagination,
    manualFiltering,
    manualSorting,
    grouping,
    expanded,
    setExpanded,
    endless
  ])
}
