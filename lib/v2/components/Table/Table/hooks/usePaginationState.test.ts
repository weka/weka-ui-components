import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usePaginationState } from './usePaginationState'

const PAGE_SIZE = 25
const FIRST_PAGE = 1
const TARGET_PAGE = 3
const MANUAL_CONTROLLED_PAGE = 2
const MANUAL_TARGET_PAGE = 4
const MANUAL_TARGET_INDEX = 3
const CONTROLLED_PAGE = 5

describe('usePaginationState', () => {
  it('defaults to the first page in client mode', () => {
    const { result } = renderHook(() =>
      usePaginationState(false, undefined, undefined, PAGE_SIZE)
    )
    expect(result.current.currentPage).toBe(FIRST_PAGE)
  })

  it('updates the internal page on change in client mode', () => {
    const { result } = renderHook(() =>
      usePaginationState(false, undefined, undefined, PAGE_SIZE)
    )
    act(() => result.current.handlePageChange(TARGET_PAGE))
    expect(result.current.currentPage).toBe(TARGET_PAGE)
  })

  it('reports zero-based pageIndex through onPaginationChange in manual mode', () => {
    const onPaginationChange = vi.fn()
    const { result } = renderHook(() =>
      usePaginationState(
        true,
        MANUAL_CONTROLLED_PAGE,
        onPaginationChange,
        PAGE_SIZE
      )
    )
    act(() => result.current.handlePageChange(MANUAL_TARGET_PAGE))
    expect(onPaginationChange).toHaveBeenCalledWith({
      pageIndex: MANUAL_TARGET_INDEX,
      pageSize: PAGE_SIZE
    })
    expect(result.current.currentPage).toBe(MANUAL_CONTROLLED_PAGE)
  })

  it('lets the controlled currentPage prop win', () => {
    const { result } = renderHook(() =>
      usePaginationState(false, CONTROLLED_PAGE, undefined, PAGE_SIZE)
    )
    expect(result.current.currentPage).toBe(CONTROLLED_PAGE)
  })
})
