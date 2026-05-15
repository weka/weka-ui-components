import type { RefObject } from 'react'

import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCloseOnScroll } from './useCloseOnScroll'

const THRESHOLD_EXCEEDING_DELTA = 20

function dispatchWheel(target: EventTarget, deltaY: number): void {
  const event = new WheelEvent('wheel', {
    deltaY,
    deltaMode: 0,
    bubbles: true,
    cancelable: false
  })
  target.dispatchEvent(event)
}

describe('useCloseOnScroll', () => {
  beforeEach(() => {
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('adds a wheel listener with capture when open', () => {
    renderHook(() => useCloseOnScroll(true, vi.fn()))

    expect(window.addEventListener).toHaveBeenCalledWith(
      'wheel',
      expect.any(Function),
      expect.objectContaining({ capture: true, passive: true })
    )
  })

  it('does not add a wheel listener when not open', () => {
    renderHook(() => useCloseOnScroll(false, vi.fn()))

    expect(window.addEventListener).not.toHaveBeenCalledWith(
      'wheel',
      expect.any(Function),
      expect.anything()
    )
  })

  it('removes the listener when transitioning from open to closed', () => {
    const { rerender } = renderHook(
      ({ open }: { open: boolean }) => useCloseOnScroll(open, vi.fn()),
      { initialProps: { open: true } }
    )

    rerender({ open: false })

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'wheel',
      expect.any(Function),
      true
    )
  })

  it('calls onClose after wheel delta exceeds the threshold', () => {
    const handleClose = vi.fn()
    renderHook(() => useCloseOnScroll(true, handleClose))

    dispatchWheel(document.body, THRESHOLD_EXCEEDING_DELTA)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('ignores wheel events that originate inside the dropdown', () => {
    const handleClose = vi.fn()
    const dropdown = document.createElement('div')
    const inner = document.createElement('span')
    dropdown.appendChild(inner)
    document.body.appendChild(dropdown)
    const dropdownRef: RefObject<HTMLElement> = { current: dropdown }

    renderHook(() => useCloseOnScroll(true, handleClose, dropdownRef))

    dispatchWheel(inner, THRESHOLD_EXCEEDING_DELTA)

    expect(handleClose).not.toHaveBeenCalled()
    document.body.removeChild(dropdown)
  })
})
