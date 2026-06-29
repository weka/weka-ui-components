import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeMode,
  OnChangeFn,
  SortingState,
  VisibilityState
} from '@tanstack/react-table'

import { useMemo } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

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
  manualSorting?: boolean
}

/**
 * Builds the memoized TanStack table options, wiring sorting, filtering,
 * column visibility, resizing, and either client-side or manual pagination.
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
  manualSorting
}: UseTableOptionsParams<TData>) {
  return useMemo(() => {
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
        }
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      defaultColumn: {
        size: DEFAULT_COLUMN_SIZE,
        minSize: MIN_COLUMN_SIZE,
        maxSize: MAX_COLUMN_SIZE,
        cell: DefaultCell as ColumnDef<TData>['cell']
      },
      getCoreRowModel: getCoreRowModel(),
      ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
      getFilteredRowModel: getFilteredRowModel(),
      columnResizeMode,
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
    manualSorting
  ])
}
