import { useEffect } from 'react'
import { ExtendedColumnFilter, ExtendedTable } from '../types'
import { SortingState } from '@tanstack/react-table'

function useResetPagination<Data>({
  table,
  columnFilters,
  manualPagination,
  setCurrentPage,
  sorting,
  scrollElement,
  outsideFilters
}: {
  table: ExtendedTable<Data>
  columnFilters: ExtendedColumnFilter[]
  manualPagination?: boolean
  setCurrentPage: (page: number) => void
  sorting: SortingState
  scrollElement: HTMLElement | null
  outsideFilters?: unknown
}) {
  useEffect(() => {
    if (scrollElement) {
      scrollElement.scrollTop = 0
    }

    setCurrentPage(1)
    table.setPageIndex(0)
  }, [
    manualPagination,
    table,
    setCurrentPage,
    columnFilters,
    sorting,
    scrollElement,
    outsideFilters
  ])
}

export default useResetPagination
