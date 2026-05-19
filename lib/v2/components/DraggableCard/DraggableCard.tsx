import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  ReactNode
} from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { DOM_EVENTS, EMPTY_STRING } from '../../utils/consts'

import {
  DEFAULT_EDGE_THRESHOLD,
  DRAG_START_THRESHOLD,
  DRAGGING_CARD_CLASS,
  PREVIEW_OFFSET,
  PREVIEW_OPACITY,
  PREVIEW_Z_INDEX,
  STYLE_ELEMENT_ID
} from './consts'

import styles from './draggableCard.module.scss'

const DRAGGABLE_ID_ATTR = 'data-draggable-id'
const DRAGGABLE_ID_SELECTOR = `[${DRAGGABLE_ID_ATTR}]`

type DragEventHandler = (id: string, e: ReactMouseEvent | MouseEvent) => void

function createPreviewElement(
  source: HTMLDivElement,
  clientX: number,
  clientY: number
): HTMLDivElement {
  const clone = source.cloneNode(true) as HTMLDivElement
  clone.style.position = 'fixed'
  clone.style.pointerEvents = 'none'
  clone.style.zIndex = String(PREVIEW_Z_INDEX)
  clone.style.opacity = String(PREVIEW_OPACITY)
  clone.style.width = `${source.offsetWidth}px`
  clone.style.height = `${source.offsetHeight}px`
  clone.style.left = `${clientX - PREVIEW_OFFSET}px`
  clone.style.top = `${clientY - PREVIEW_OFFSET}px`
  return clone
}

function updatePreviewPosition(
  preview: HTMLDivElement,
  clientX: number,
  clientY: number
): void {
  preview.style.left = `${clientX - PREVIEW_OFFSET}px`
  preview.style.top = `${clientY - PREVIEW_OFFSET}px`
}

function findDraggableTargetId(
  clientX: number,
  clientY: number,
  preview: HTMLDivElement | null,
  excludeId: string
): string | null {
  if (preview) {
    preview.style.display = 'none'
  }

  const elementUnder = document.elementFromPoint(clientX, clientY)
  const draggableCard = elementUnder?.closest(DRAGGABLE_ID_SELECTOR)

  if (preview) {
    preview.style.display = EMPTY_STRING
  }

  if (draggableCard) {
    const targetId = draggableCard.getAttribute(DRAGGABLE_ID_ATTR)
    if (targetId && targetId !== excludeId) {
      return targetId
    }
  }
  return null
}

function cleanupDragState(): void {
  document.documentElement.classList.remove(DRAGGING_CARD_CLASS)
  document.body.classList.remove(DRAGGING_CARD_CLASS)
  const styleElement = document.getElementById(STYLE_ELEMENT_ID)
  if (styleElement) {
    styleElement.remove()
  }
}

function hasExceededDragThreshold(
  startPos: { x: number; y: number },
  currentX: number,
  currentY: number
): boolean {
  const dx = Math.abs(currentX - startPos.x)
  const dy = Math.abs(currentY - startPos.y)
  return dx > DRAG_START_THRESHOLD || dy > DRAG_START_THRESHOLD
}

export interface DraggableCardProps {
  children: ReactNode
  id: string
  onDragStart?: DragEventHandler
  onDragEnd?: () => void
  onDragOver?: DragEventHandler
  onDrop?: DragEventHandler
  isDragging?: boolean
  isDropTarget?: boolean
  extraClass?: string
  style?: CSSProperties
  edgeThreshold?: number
  dataTestId?: string
}

export function DraggableCard({
  children,
  id,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging = false,
  isDropTarget = false,
  extraClass,
  style,
  edgeThreshold = DEFAULT_EDGE_THRESHOLD,
  dataTestId
}: Readonly<DraggableCardProps>) {
  const [isNearEdge, setIsNearEdge] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isLocalDragging, setIsLocalDragging] = useState(false)
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null)
  const hasDraggedRef = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const rect = target.getBoundingClientRect()

      const nearEdge =
        e.clientX - rect.left < edgeThreshold ||
        rect.right - e.clientX < edgeThreshold ||
        e.clientY - rect.top < edgeThreshold ||
        rect.bottom - e.clientY < edgeThreshold

      setIsNearEdge(nearEdge)
    },
    [edgeThreshold]
  )

  const handleMouseLeave = useCallback(() => {
    setIsNearEdge(false)
  }, [])

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (!isNearEdge) {
        return
      }
      e.preventDefault()
      setIsMouseDown(true)
      dragStartPosRef.current = { x: e.clientX, y: e.clientY }
      hasDraggedRef.current = false

      document.documentElement.classList.add(DRAGGING_CARD_CLASS)
      document.body.classList.add(DRAGGING_CARD_CLASS)

      let styleElement = document.getElementById(
        STYLE_ELEMENT_ID
      ) as HTMLStyleElement
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = STYLE_ELEMENT_ID
        document.head.appendChild(styleElement)
      }

      styleElement.textContent = `
        *, *:hover, *:active, *:focus {
          cursor: grabbing !important;
          cursor: -webkit-grabbing !important;
          cursor: -moz-grabbing !important;
        }
      `
    },
    [isNearEdge]
  )

  const initiateDrag = useCallback(
    (e: MouseEvent) => {
      hasDraggedRef.current = true
      setIsLocalDragging(true)

      if (cardRef.current && !previewRef.current) {
        const clone = createPreviewElement(
          cardRef.current,
          e.clientX,
          e.clientY
        )
        document.body.appendChild(clone)
        previewRef.current = clone
      }

      onDragStart?.(id, e)
    },
    [id, onDragStart]
  )

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDown || !dragStartPosRef.current) {
        return
      }

      const shouldStartDrag =
        !hasDraggedRef.current &&
        hasExceededDragThreshold(dragStartPosRef.current, e.clientX, e.clientY)

      if (shouldStartDrag) {
        initiateDrag(e)
      }

      if (hasDraggedRef.current && previewRef.current) {
        updatePreviewPosition(previewRef.current, e.clientX, e.clientY)
      }

      if (hasDraggedRef.current) {
        const targetId = findDraggableTargetId(
          e.clientX,
          e.clientY,
          previewRef.current,
          id
        )
        if (targetId) {
          onDragOver?.(targetId, e)
        }
      }
    },
    [isMouseDown, id, initiateDrag, onDragOver]
  )

  const handleGlobalMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDown) {
        return
      }

      setIsMouseDown(false)

      if (hasDraggedRef.current) {
        const targetId = findDraggableTargetId(
          e.clientX,
          e.clientY,
          previewRef.current,
          id
        )
        if (targetId) {
          onDrop?.(targetId, e)
        }
        setIsLocalDragging(false)

        if (previewRef.current) {
          previewRef.current.remove()
          previewRef.current = null
        }
        onDragEnd?.()
      }

      cleanupDragState()
      dragStartPosRef.current = null
      hasDraggedRef.current = false
    },
    [isMouseDown, id, onDrop, onDragEnd]
  )

  useEffect(() => {
    if (isMouseDown) {
      window.addEventListener(DOM_EVENTS.MOUSEMOVE, handleGlobalMouseMove)
      window.addEventListener(DOM_EVENTS.MOUSEUP, handleGlobalMouseUp)

      return () => {
        window.removeEventListener(DOM_EVENTS.MOUSEMOVE, handleGlobalMouseMove)
        window.removeEventListener(DOM_EVENTS.MOUSEUP, handleGlobalMouseUp)
      }
    }
  }, [isMouseDown, handleGlobalMouseMove, handleGlobalMouseUp])

  useEffect(
    () => () => {
      if (isMouseDown && hasDraggedRef.current) {
        if (previewRef.current) {
          previewRef.current.remove()
          previewRef.current = null
        }
        cleanupDragState()
      }
    },
    [isMouseDown]
  )

  return (
    <div
      ref={cardRef}
      data-draggable-id={id}
      data-testid={dataTestId}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={style}
      className={clsx(
        styles.draggableCard,
        {
          [styles.dragging]: isDragging || isLocalDragging,
          [styles.dropTarget]: isDropTarget,
          [styles.nearEdge]: isNearEdge
        },
        extraClass
      )}
    >
      {children}
    </div>
  )
}
