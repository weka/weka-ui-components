import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { DOM_EVENTS } from '#v2/utils/consts'

const DEFAULT_OFFSET_PX = 4
const DEFAULT_SCROLL_THRESHOLD_PX = 50
const VIEWPORT_MARGIN_PX = 8

export const POPOVER_ALIGN = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center'
} as const

export type PopoverAlign = (typeof POPOVER_ALIGN)[keyof typeof POPOVER_ALIGN]

/**
 * Clamp a desired left edge so the popover never overflows the viewport. A
 * `contentWidth` of 0 (not yet measured) uses the desired left as-is.
 */
function clampLeft(desiredLeft: number, contentWidth: number): CSSProperties {
  if (contentWidth === 0) {
    return { left: desiredLeft }
  }
  const maxLeft = window.innerWidth - contentWidth - VIEWPORT_MARGIN_PX
  return { left: Math.max(VIEWPORT_MARGIN_PX, Math.min(desiredLeft, maxLeft)) }
}

/**
 * Horizontal placement for the popover. `RIGHT` (default) right-aligns to the
 * anchor's right edge (menus open leftward from their trigger); if that would
 * push the popover off the left of the viewport it falls back to a clamped left
 * edge. `LEFT` left-aligns to the anchor's left edge (dropdowns drop straight
 * down). `CENTER` centers the popover under the anchor. All non-default modes
 * are clamped on-screen.
 */
function getHorizontalPlacement(
  rect: DOMRect,
  contentWidth: number,
  align: PopoverAlign
): CSSProperties {
  if (align === POPOVER_ALIGN.LEFT) {
    return clampLeft(rect.left, contentWidth)
  }
  if (align === POPOVER_ALIGN.CENTER) {
    const centeredLeft = rect.left + rect.width / 2 - contentWidth / 2
    return clampLeft(centeredLeft, contentWidth)
  }
  if (contentWidth === 0 || rect.right - contentWidth >= VIEWPORT_MARGIN_PX) {
    return { right: window.innerWidth - rect.right }
  }
  return clampLeft(rect.left, contentWidth)
}

interface UsePopoverPositionOptions {
  offset?: number
  scrollCloseThreshold?: number
  contentRef?: RefObject<HTMLElement>
  align?: PopoverAlign
}

interface UsePopoverPositionResult {
  position: CSSProperties
}

/**
 * Hook to manage popover position relative to an anchor element.
 * Updates position on scroll/resize and closes when anchor moves too far.
 */
export function usePopoverPosition(
  isOpen: boolean,
  anchorRef: RefObject<HTMLElement>,
  onClose: () => void,
  options: UsePopoverPositionOptions = {}
): UsePopoverPositionResult {
  const {
    offset = DEFAULT_OFFSET_PX,
    scrollCloseThreshold = DEFAULT_SCROLL_THRESHOLD_PX,
    contentRef,
    align = POPOVER_ALIGN.RIGHT
  } = options

  const initialAnchorTop = useRef<number | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const getPositionStyle = useCallback((): CSSProperties => {
    const rect = anchorRef.current?.getBoundingClientRect()
    if (!rect) {
      return { position: 'fixed', visibility: 'hidden' }
    }
    const contentHeight = contentRef?.current?.offsetHeight ?? 0
    const contentWidth = contentRef?.current?.offsetWidth ?? 0
    const spaceBelow = window.innerHeight - rect.bottom

    const horizontal = getHorizontalPlacement(rect, contentWidth, align)

    const openUp =
      contentHeight > 0 &&
      contentHeight + offset > spaceBelow &&
      rect.top > spaceBelow

    const vertical: CSSProperties = openUp
      ? { bottom: window.innerHeight - rect.top + offset }
      : { top: rect.bottom + offset }

    return {
      position: 'fixed',
      visibility: 'visible',
      ...vertical,
      ...horizontal
    }
  }, [anchorRef, offset, contentRef, align])

  const [position, setPosition] = useState<CSSProperties>({
    position: 'fixed',
    visibility: 'hidden'
  })

  const updatePosition = useCallback(() => {
    const rect = anchorRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    if (initialAnchorTop.current === null) {
      initialAnchorTop.current = rect.top
    }

    const scrollDistance = Math.abs(rect.top - initialAnchorTop.current)
    const isAnchorVisible =
      rect.top >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.left >= 0 &&
      rect.right <= window.innerWidth

    if (!isAnchorVisible || scrollDistance > scrollCloseThreshold) {
      onCloseRef.current()
      return
    }

    setPosition(getPositionStyle())
  }, [anchorRef, scrollCloseThreshold, getPositionStyle])

  useEffect(() => {
    if (!isOpen) {
      initialAnchorTop.current = null
      return
    }

    const rect = anchorRef.current?.getBoundingClientRect()
    if (rect) {
      initialAnchorTop.current = rect.top
    }

    const frameId = requestAnimationFrame(() => {
      setPosition(getPositionStyle())
    })

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener(DOM_EVENTS.RESIZE, updatePosition)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener(DOM_EVENTS.RESIZE, updatePosition)
    }
  }, [isOpen, updatePosition, anchorRef, getPositionStyle])

  return { position }
}
