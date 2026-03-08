import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useWindowResize } from './useWindowResize'

describe('useWindowResize', () => {
  beforeEach(() => {
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls callback immediately on mount', () => {
    const callback = vi.fn()
    renderHook(() => useWindowResize(callback, []))

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('adds resize event listener on mount', () => {
    const callback = vi.fn()
    renderHook(() => useWindowResize(callback, []))

    expect(window.addEventListener).toHaveBeenCalledWith('resize', callback)
  })

  it('removes resize event listener on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useWindowResize(callback, []))

    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith('resize', callback)
  })

  it('re-registers listener when dependencies change', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(
      ({ deps }) => useWindowResize(callback, deps),
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
    const { rerender } = renderHook(() => useWindowResize(callback, deps))

    expect(window.addEventListener).toHaveBeenCalledTimes(1)

    rerender()

    expect(window.addEventListener).toHaveBeenCalledTimes(1)
  })
})
