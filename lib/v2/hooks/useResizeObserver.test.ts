import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useResizeObserver } from './useResizeObserver'

describe('useResizeObserver', () => {
  beforeEach(() => {
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls callback immediately on mount', () => {
    const callback = vi.fn()
    renderHook(() => useResizeObserver(callback, []))

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('adds resize event listener on mount', () => {
    const callback = vi.fn()
    renderHook(() => useResizeObserver(callback, []))

    expect(window.addEventListener).toHaveBeenCalledWith('resize', callback)
  })

  it('removes resize event listener on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useResizeObserver(callback, []))

    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith('resize', callback)
  })

  it('re-registers listener when dependencies change', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ deps }) => useResizeObserver(callback, deps),
      { initialProps: { deps: [1] } }
    )

    expect(window.addEventListener).toHaveBeenCalledTimes(1)

    rerender({ deps: [2] })

    expect(window.removeEventListener).toHaveBeenCalledTimes(1)
    expect(window.addEventListener).toHaveBeenCalledTimes(2)
  })

  it('does not re-register listener when dependencies are stable', () => {
    const callback = vi.fn()
    const deps = [1]
    const { rerender } = renderHook(() => useResizeObserver(callback, deps))

    expect(window.addEventListener).toHaveBeenCalledTimes(1)

    rerender()

    expect(window.addEventListener).toHaveBeenCalledTimes(1)
  })
})
