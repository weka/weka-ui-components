import type { Table } from '@tanstack/react-table'

import { useEffect, useRef } from 'react'

const INITIAL_SCROLL_DELAY_MS = 100
const SCROLL_RETRY_DELAY_MS = 50
const MAX_SCROLL_ATTEMPTS = 20
const FIRST_PAGE = 1
const NOT_FOUND_INDEX = -1

type RowIdValue = string | number | null | undefined

interface UseScrollToRowParams<TData> {
  scrollToRowId: RowIdValue
  manualPagination: boolean | undefined
  table: Table<TData>
  getRowId?: (row: TData) => RowIdValue
  effectivePageSize: number
  currentPage: number
  setInternalCurrentPage: (page: number) => void
  data: TData[]
  isGrouped: boolean
}

function resolveRowId<TData>(
  rowData: TData,
  getRowId?: (row: TData) => RowIdValue
): RowIdValue {
  if (getRowId) {
    return getRowId(rowData)
  }
  if (typeof rowData === 'object' && rowData !== null && 'id' in rowData) {
    return (rowData as { id: string | number }).id
  }
  return undefined
}

function toTargetPage(index: number, effectivePageSize: number): number {
  return Math.floor(index / effectivePageSize) + FIRST_PAGE
}

/**
 * Grouped pagination counts top-level group rows, and the target row may be a
 * leaf nested inside a collapsed group — search the full grouped tree
 * (flatRows includes leaves regardless of expand state), expand the leaf's
 * top-level group, and page by that group's index rather than the leaf's.
 */
function resolveGroupedTargetPage<TData>(
  table: Table<TData>,
  scrollToRowId: RowIdValue,
  getRowId: ((row: TData) => RowIdValue) | undefined,
  effectivePageSize: number
): number | null {
  const targetRow = table
    .getGroupedRowModel()
    .flatRows.find(
      (row) =>
        String(resolveRowId(row.original, getRowId)) === String(scrollToRowId)
    )

  if (!targetRow) {
    return null
  }

  let topRow = targetRow
  let parentRow = topRow.getParentRow()
  while (parentRow) {
    topRow = parentRow
    parentRow = topRow.getParentRow()
  }

  if (!topRow.getIsExpanded()) {
    topRow.toggleExpanded(true)
  }

  const topRowIndex = table
    .getGroupedRowModel()
    .rows.findIndex((row) => row.id === topRow.id)

  return topRowIndex === NOT_FOUND_INDEX
    ? null
    : toTargetPage(topRowIndex, effectivePageSize)
}

function resolveFlatTargetPage<TData>(
  table: Table<TData>,
  scrollToRowId: RowIdValue,
  getRowId: ((row: TData) => RowIdValue) | undefined,
  effectivePageSize: number
): number | null {
  const rowIndex = table
    .getPrePaginationRowModel()
    .rows.findIndex(
      (row) =>
        String(resolveRowId(row.original, getRowId)) === String(scrollToRowId)
    )

  return rowIndex === NOT_FOUND_INDEX
    ? null
    : toTargetPage(rowIndex, effectivePageSize)
}

/**
 * Brings the row matching `scrollToRowId` into view, paging to it first when
 * client-side pagination would otherwise hide it. When grouped, the target
 * may be a leaf nested in a collapsed group — it is located via the full
 * grouped tree, its top-level group is expanded, and paging targets that
 * group's index rather than the leaf's. Retries briefly while the row
 * element mounts. Under manual pagination the consumer owns which page is
 * shown, so paging is skipped and the hook only scrolls once the row mounts —
 * re-attempting whenever `data` changes (e.g. a new server page arrives).
 */
export function useScrollToRow<TData>({
  scrollToRowId,
  manualPagination,
  table,
  getRowId,
  effectivePageSize,
  currentPage,
  setInternalCurrentPage,
  data,
  isGrouped
}: UseScrollToRowParams<TData>) {
  const lastScrolledRowIdRef = useRef<string | number | null>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (scrollToRowId === null || scrollToRowId === undefined) {
      lastScrolledRowIdRef.current = null
      return
    }

    if (lastScrolledRowIdRef.current === scrollToRowId) {
      return
    }

    if (!manualPagination) {
      const targetPage = isGrouped
        ? resolveGroupedTargetPage(
            table,
            scrollToRowId,
            getRowId,
            effectivePageSize
          )
        : resolveFlatTargetPage(
            table,
            scrollToRowId,
            getRowId,
            effectivePageSize
          )

      if (targetPage === null) {
        return
      }
      if (targetPage !== currentPage) {
        setInternalCurrentPage(targetPage)
      }
    }

    let isCancelled = false

    const tryScroll = (attempt: number) => {
      if (isCancelled) {
        return
      }
      const rowElement = document.querySelector(
        `[data-row-id="${scrollToRowId}"]`
      )
      if (rowElement) {
        lastScrolledRowIdRef.current = scrollToRowId
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      if (attempt >= MAX_SCROLL_ATTEMPTS) {
        return
      }
      scrollTimeoutRef.current = setTimeout(
        () => tryScroll(attempt + 1),
        SCROLL_RETRY_DELAY_MS
      )
    }

    scrollTimeoutRef.current = setTimeout(
      () => tryScroll(0),
      INITIAL_SCROLL_DELAY_MS
    )

    return () => {
      isCancelled = true
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
    }
  }, [
    scrollToRowId,
    table,
    getRowId,
    effectivePageSize,
    currentPage,
    manualPagination,
    setInternalCurrentPage,
    data,
    isGrouped
  ])
}
