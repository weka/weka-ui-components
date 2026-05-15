import { type RefObject, useEffect, useRef } from 'react'

import { DOM_EVENTS } from '#v2/utils/consts'

const SCROLL_CLOSE_THRESHOLD = 15
const LINE_HEIGHT_PX = 20
const DELTA_MODE_LINE = 1
const DELTA_MODE_PAGE = 2

function getDeltaMultiplier(
  deltaMode: number,
  containerHeight: number
): number {
  if (deltaMode === DELTA_MODE_LINE) {
    return LINE_HEIGHT_PX
  }
  if (deltaMode === DELTA_MODE_PAGE) {
    return containerHeight
  }
  return 1
}

function toPixels(delta: number, deltaMode: number): number {
  return Math.abs(delta) * getDeltaMultiplier(deltaMode, window.innerHeight)
}

function findScrollableAncestor(el: HTMLElement): HTMLElement | null {
  let current = el.parentElement
  while (current && current !== document.body) {
    const { overflow, overflowY } = window.getComputedStyle(current)
    if (/(auto|scroll)/.test(overflow + overflowY)) {
      return current
    }
    current = current.parentElement
  }
  return null
}

/**
 * Closes a dropdown/popover after the user scrolls past a small threshold outside it.
 *
 * Uses `wheel` events instead of `scroll` so it fires before a portal backdrop
 * (e.g. MUI's invisible Menu backdrop) can swallow the event. The wheel delta is
 * forwarded to the nearest scrollable ancestor of `anchorRef` so the container
 * scrolls in the same gesture that closes the dropdown — no double-scroll needed.
 */
export function useCloseOnScroll(
  isOpen: boolean,
  onClose: () => void,
  dropdownRef?: RefObject<HTMLElement>,
  anchorRef?: RefObject<HTMLElement>
): void {
  const onCloseRef = useRef(onClose)
  const accumulatedDelta = useRef(0)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      accumulatedDelta.current = 0
      return
    }

    accumulatedDelta.current = 0
    const scrollContainer = anchorRef?.current
      ? findScrollableAncestor(anchorRef.current)
      : null

    const handleWheel = (e: WheelEvent) => {
      if (dropdownRef?.current?.contains(e.target as Node)) {
        return
      }

      if (scrollContainer && !scrollContainer.contains(e.target as Node)) {
        const multiplier = getDeltaMultiplier(
          e.deltaMode,
          scrollContainer.clientHeight
        )
        scrollContainer.scrollBy({
          top: e.deltaY * multiplier,
          left: e.deltaX * multiplier
        })
      }

      accumulatedDelta.current +=
        toPixels(e.deltaY, e.deltaMode) + toPixels(e.deltaX, e.deltaMode)
      if (accumulatedDelta.current >= SCROLL_CLOSE_THRESHOLD) {
        onCloseRef.current()
      }
    }

    window.addEventListener(DOM_EVENTS.WHEEL, handleWheel, {
      capture: true,
      passive: true
    })
    return () => {
      window.removeEventListener(DOM_EVENTS.WHEEL, handleWheel, true)
    }
  }, [isOpen, dropdownRef, anchorRef])
}
