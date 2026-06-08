import type { PaginationState } from '@tanstack/react-table'

import { useState } from 'react'

import { NOOP } from '#v2/utils/consts'

const FIRST_PAGE = 1

/**
 * Manages the current page for both client-side and server-side (manual)
 * pagination. In manual mode the page is controlled by the consumer and
 * changes are reported through `onPaginationChange`.
 */
export function usePaginationState(
  manualPagination: boolean | undefined,
  currentPageProp: number | undefined,
  onPaginationChange: ((pagination: PaginationState) => void) | undefined,
  effectivePageSize: number
) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(FIRST_PAGE)

  const currentPage = currentPageProp ?? internalCurrentPage
  const setCurrentPage = manualPagination ? NOOP : setInternalCurrentPage

  const handlePageChange = (page: number) => {
    if (manualPagination) {
      onPaginationChange?.({ pageIndex: page - 1, pageSize: effectivePageSize })
      return
    }
    setInternalCurrentPage(page)
  }

  return {
    currentPage,
    setCurrentPage,
    setInternalCurrentPage,
    handlePageChange
  }
}
