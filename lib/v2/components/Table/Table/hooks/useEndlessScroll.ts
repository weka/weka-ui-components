import type { Row } from '@tanstack/react-table'
import type { RefObject } from 'react'

import { useEffect, useRef } from 'react'

import { shouldLoadMore } from '../endlessScroll'

interface UseEndlessScrollParams<TData> {
  endless: boolean
  hasMore: boolean | undefined
  isLoadingMore: boolean | undefined
  loading: boolean | undefined
  onLoadMore: (() => void) | undefined
  sentinelRef: RefObject<HTMLDivElement>
  scrollContainerRef: RefObject<HTMLDivElement>
  paginatedRows: Row<TData>[]
  prePaginationRows: Row<TData>[]
  isCompact: boolean
  showPagination: boolean
}

interface UseEndlessScrollResult<TData> {
  displayRows: Row<TData>[]
  effectiveIsCompact: boolean
  effectiveShowPagination: boolean
}

/**
 * Wires an IntersectionObserver on `sentinelRef` (root = `scrollContainerRef`)
 * and calls `onLoadMore` whenever the sentinel enters the viewport, `hasMore`
 * is true, and neither `isLoadingMore` nor `loading` is in flight.
 *
 * A ref guard (`loadRequestedRef`) makes each request fire at most once: it is
 * set synchronously when `onLoadMore` is called — so rapid intersection
 * callbacks that fire before the parent re-renders with the new loading flag
 * cannot trigger duplicate requests — and reset when the parent acknowledges
 * the request (`isLoadingMore` turns true), so the next page can load once the
 * current one settles. Tying the reset to `isLoadingMore` rather than the row
 * count keeps client-side filtering from clearing the guard and still recovers
 * from loads that return no new rows.
 *
 * Also derives display-ready values so the Table component itself remains free
 * of conditional branches for endless-mode overrides:
 * - `displayRows` — all pre-pagination rows when endless, paginated otherwise
 * - `effectiveIsCompact` — always false in endless mode
 * - `effectiveShowPagination` — always false in endless mode
 */
export function useEndlessScroll<TData>({
  endless,
  hasMore,
  isLoadingMore,
  loading,
  onLoadMore,
  sentinelRef,
  scrollContainerRef,
  paginatedRows,
  prePaginationRows,
  isCompact,
  showPagination
}: UseEndlessScrollParams<TData>): UseEndlessScrollResult<TData> {
  const loadRequestedRef = useRef(false)

  useEffect(() => {
    if (isLoadingMore) {
      loadRequestedRef.current = false
    }
  }, [isLoadingMore])

  useEffect(() => {
    if (!endless) {
      return undefined
    }
    const sentinel = sentinelRef.current
    const root = scrollContainerRef.current
    if (!sentinel || !root) {
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry &&
          shouldLoadMore(
            entry.isIntersecting,
            hasMore,
            isLoadingMore,
            loading
          ) &&
          !loadRequestedRef.current
        ) {
          loadRequestedRef.current = true
          onLoadMore?.()
        }
      },
      { root }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [
    endless,
    hasMore,
    isLoadingMore,
    loading,
    onLoadMore,
    sentinelRef,
    scrollContainerRef
  ])

  return {
    displayRows: endless ? prePaginationRows : paginatedRows,
    effectiveIsCompact: endless ? false : isCompact,
    effectiveShowPagination: endless ? false : showPagination
  }
}
