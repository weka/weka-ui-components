import { useEffect, useRef } from 'react'
import { ExtendedColumnFilter, ExtendedTable } from '../types'
import { SortingState } from '@tanstack/react-table'

function useResetPagination<Data>({
  table,
  columnFilters,
  manualPagination,
  sorting,
  scrollElement,
  outsideFilters
}: {
  table: ExtendedTable<Data>
  columnFilters: ExtendedColumnFilter[]
  manualPagination?: boolean
  sorting: SortingState
  scrollElement: HTMLElement | null
  outsideFilters?: unknown
}) {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (scrollElement) {
      scrollElement.scrollTop = 0
    }

    table.setPageIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    manualPagination,
    table,
    columnFilters,
    sorting,
    outsideFilters
    // scrollElement intentionally excluded to avoid re-renders
  ])
}

export default useResetPagination
