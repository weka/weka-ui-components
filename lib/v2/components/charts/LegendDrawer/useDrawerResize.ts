import {
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import {
  DEFAULT_CONTAINER_WIDTH,
  getDrawerDefaultWidth,
  getScaledDrawerWidth
} from './legendDrawerUtils'

const MIN_WIDTH = 100
const MAX_WIDTH = 400

interface DrawerResizeState {
  isOpen: boolean
  width: number
  isDragging: boolean
}

function computeInitialWidth(
  customDefaultWidth: number | undefined,
  showValues: boolean
): number {
  if (customDefaultWidth) {
    return customDefaultWidth
  }
  return getDrawerDefaultWidth(DEFAULT_CONTAINER_WIDTH, showValues)
}

function computeDisplayWidth(
  isDragging: boolean,
  hasManuallyAdjusted: boolean,
  stateWidth: number,
  derivedDefaultWidth: number
): number {
  if (isDragging || hasManuallyAdjusted) {
    return stateWidth
  }
  return derivedDefaultWidth
}

interface UseDrawerResizeParams {
  defaultOpen: boolean
  customDefaultWidth?: number
  showValues: boolean
  onVisibilityChange?: (isOpen: boolean) => void
  onWidthChange?: (width: number) => void
}

/**
 * Manages the legend drawer open state, drag-to-resize interaction, and the
 * container-driven default width (via a ResizeObserver on the parent element).
 */
export function useDrawerResize({
  defaultOpen,
  customDefaultWidth,
  showValues,
  onVisibilityChange,
  onWidthChange
}: UseDrawerResizeParams) {
  const initialWidth = computeInitialWidth(customDefaultWidth, showValues)

  const [state, setState] = useState<DrawerResizeState>({
    isOpen: defaultOpen,
    width: initialWidth,
    isDragging: false
  })

  const [hasManuallyAdjusted, setHasManuallyAdjusted] = useState(false)
  const [containerWidth, setContainerWidth] = useState(DEFAULT_CONTAINER_WIDTH)
  const drawerRef = useRef<HTMLDivElement>(null)
  const lastOpenWidth = useRef(initialWidth)
  const lastReportedVisibility = useRef<boolean | null>(null)
  const lastReportedWidth = useRef<number | null>(null)
  const startDragX = useRef<number>(0)
  const startWidth = useRef<number>(0)

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (defaultOpen) {
      setState((prev) => ({
        ...prev,
        isOpen: true,
        width: lastOpenWidth.current
      }))
    } else {
      setState((prev) => ({ ...prev, isOpen: false }))
      setHasManuallyAdjusted(false)
    }
  }, [defaultOpen])

  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) {
      return
    }

    const parent = drawer.parentElement
    if (!parent) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth((prev) =>
          prev === entry.contentRect.width ? prev : entry.contentRect.width
        )
      }
    })

    observer.observe(parent)
    return () => observer.disconnect()
  }, [])

  const derivedDefaultWidth = useMemo(() => {
    if (customDefaultWidth) {
      return getScaledDrawerWidth(
        containerWidth,
        customDefaultWidth,
        showValues
      )
    }
    return getDrawerDefaultWidth(containerWidth, showValues)
  }, [containerWidth, showValues, customDefaultWidth])

  const displayWidth = computeDisplayWidth(
    state.isDragging,
    hasManuallyAdjusted,
    state.width,
    derivedDefaultWidth
  )

  useEffect(() => {
    if (state.isOpen === lastReportedVisibility.current) {
      return
    }
    lastReportedVisibility.current = state.isOpen
    onVisibilityChange?.(state.isOpen)
  }, [state.isOpen, onVisibilityChange])

  useEffect(() => {
    const newWidth = state.isOpen ? displayWidth : 0
    if (newWidth === lastReportedWidth.current) {
      return
    }
    lastReportedWidth.current = newWidth
    onWidthChange?.(newWidth)
  }, [displayWidth, state.isOpen, onWidthChange])

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      startDragX.current = e.clientX
      startWidth.current = displayWidth
      setState((prev) => ({ ...prev, isDragging: true, width: displayWidth }))
    },
    [displayWidth]
  )

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!state.isDragging) {
        return
      }

      const deltaX = startDragX.current - e.clientX
      const newWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, startWidth.current + deltaX)
      )

      setState((prev) => ({ ...prev, width: newWidth }))
      lastOpenWidth.current = newWidth
    },
    [state.isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setState((prev) => {
      if (startWidth.current !== prev.width) {
        setHasManuallyAdjusted(true)
      }
      return { ...prev, isDragging: false }
    })
  }, [])

  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp])

  return {
    isOpen: state.isOpen,
    isDragging: state.isDragging,
    drawerRef,
    displayWidth,
    handleMouseDown
  }
}
