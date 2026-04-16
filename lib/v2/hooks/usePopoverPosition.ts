import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { DOM_EVENTS } from '../utils/consts'

const DEFAULT_OFFSET_PX = 4
const DEFAULT_SCROLL_THRESHOLD_PX = 50

interface UsePopoverPositionOptions {
  offset?: number
  scrollCloseThreshold?: number
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
    scrollCloseThreshold = DEFAULT_SCROLL_THRESHOLD_PX
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
    return {
      position: 'fixed',
      top: rect.bottom + offset,
      right: window.innerWidth - rect.right,
      visibility: 'visible'
    }
  }, [anchorRef, offset])

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
