import type { RefObject } from 'react'
import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useClickOutside } from './useClickOutside'

describe('useClickOutside', () => {
  let ref: RefObject<HTMLElement>
  let element: HTMLDivElement

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
    ref = { current: element }
    vi.spyOn(document, 'addEventListener')
    vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    document.body.removeChild(element)
    vi.restoreAllMocks()
  })

  it('adds mousedown event listener on mount', () => {
    const handler = vi.fn()
    renderHook(() => useClickOutside(ref, handler))

    expect(document.addEventListener).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    )
  })

  it('removes mousedown event listener on unmount', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() => useClickOutside(ref, handler))

    unmount()

    expect(document.removeEventListener).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    )
  })

  it('calls handler when clicking outside the ref element', () => {
    const handler = vi.fn()
    renderHook(() => useClickOutside(ref, handler))

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    const event = new MouseEvent('mousedown', { bubbles: true })
    Object.defineProperty(event, 'target', { value: outsideElement })
    document.dispatchEvent(event)

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(outsideElement)
  })

  it('does not call handler when clicking inside the ref element', () => {
    const handler = vi.fn()
    renderHook(() => useClickOutside(ref, handler))

    const event = new MouseEvent('mousedown', { bubbles: true })
    Object.defineProperty(event, 'target', { value: element })
    document.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()
  })

  it('does not add listener when enabled is false', () => {
    const handler = vi.fn()
    renderHook(() => useClickOutside(ref, handler, { enabled: false }))

    expect(document.addEventListener).not.toHaveBeenCalled()
  })

  it('does not call handler when clicking inside additional refs', () => {
    const handler = vi.fn()
    const additionalElement = document.createElement('div')
    document.body.appendChild(additionalElement)
    const additionalRef = { current: additionalElement }

    renderHook(() =>
      useClickOutside(ref, handler, { additionalRefs: [additionalRef] })
    )

    const event = new MouseEvent('mousedown', { bubbles: true })
    Object.defineProperty(event, 'target', { value: additionalElement })
    document.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(additionalElement)
  })

  it('does not call handler when clicking on elements matching selectors', () => {
    const handler = vi.fn()
    const popupElement = document.createElement('div')
    popupElement.className = 'popup'
    document.body.appendChild(popupElement)

    renderHook(() =>
      useClickOutside(ref, handler, { additionalSelectors: ['.popup'] })
    )

    const event = new MouseEvent('mousedown', { bubbles: true })
    Object.defineProperty(event, 'target', { value: popupElement })
    document.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(popupElement)
  })
})
