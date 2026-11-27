import type { ColumnReorderConfig } from '../columnOrder'
import type {
  ColumnDef,
  ColumnOrderState,
  OnChangeFn
} from '@tanstack/react-table'
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react'

import { useEffect, useMemo, useRef, useState } from 'react'
import { functionalUpdate } from '@tanstack/react-table'

import { DOM_EVENTS } from '#v2/utils/consts'

import { extractColumnIds } from '../../tableUtils'
import {
  moveColumnId,
  normalizeColumnOrder,
  splitColumnIds
} from '../columnOrder'

import styles from '../table.module.scss'

const DRAG_START_THRESHOLD = 5
const EDGE_SCROLL_ZONE = 40
const EDGE_SCROLL_STEP = 20
const PRIMARY_BUTTON = 0
const EMPTY_ORDER: ColumnOrderState = []

export const COLUMN_ID_ATTR = 'data-column-id'

const NON_DRAG_TARGETS = `button, input, .${styles.resizer}`

interface UseColumnReorderParams<TData> {
  columns: ColumnDef<TData>[]
  columnReorder?: ColumnReorderConfig
  pinFirstColumn: boolean
  initialColumnOrder?: ColumnOrderState
  onColumnOrderChange?: (order: ColumnOrderState) => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

function findHeaderColumnIdAt(row: Element, clientX: number) {
  const cells = row.querySelectorAll(`[${COLUMN_ID_ATTR}]`)
  for (const cell of cells) {
    const { left, right } = cell.getBoundingClientRect()
    if (clientX >= left && clientX < right) {
      return cell.getAttribute(COLUMN_ID_ATTR)
    }
  }
  return null
}

function scrollNearEdge(container: HTMLElement | null, clientX: number) {
  if (!container) {
    return
  }
  const { left, right } = container.getBoundingClientRect()
  if (clientX < left + EDGE_SCROLL_ZONE) {
    container.scrollLeft -= EDGE_SCROLL_STEP
    return
  }
  if (clientX > right - EDGE_SCROLL_ZONE) {
    container.scrollLeft += EDGE_SCROLL_STEP
  }
}

/** Swallows the click that follows a drag so it does not also toggle sorting. */
function suppressNextClick() {
  const stop = (event: Event) => {
    event.stopPropagation()
    event.preventDefault()
  }
  window.addEventListener(DOM_EVENTS.CLICK, stop, { capture: true, once: true })
  setTimeout(() =>
    window.removeEventListener(DOM_EVENTS.CLICK, stop, { capture: true })
  )
}

/**
 * Owns the column order and the header drag gesture. Disabled (definition
 * order, nothing draggable) unless `columnReorder` is given. Columns swap live
 * as the pointer crosses them, so the table itself is the drag feedback; the
 * only extra cue is the grab/grabbing cursor. `onColumnOrderChange` fires once
 * per drop, with the full order of the `columns` ids.
 */
export function useColumnReorder<TData>({
  columns,
  columnReorder,
  pinFirstColumn,
  initialColumnOrder,
  onColumnOrderChange,
  scrollContainerRef
}: UseColumnReorderParams<TData>) {
  const [savedOrder, setSavedOrder] = useState<ColumnOrderState>(
    () => initialColumnOrder ?? EMPTY_ORDER
  )
  const endDragRef = useRef<(() => void) | null>(null)

  useEffect(() => () => endDragRef.current?.(), [])

  const isEnabled = Boolean(columnReorder)
  const lockedStart = Math.max(
    columnReorder?.lockedStart ?? 0,
    pinFirstColumn ? 1 : 0
  )
  const lockedEnd = columnReorder?.lockedEnd ?? 0

  const { columnOrder, movableIds } = useMemo(() => {
    if (!isEnabled) {
      return { columnOrder: EMPTY_ORDER, movableIds: new Set<string>() }
    }
    const columnIds = extractColumnIds(columns)
    const locks = { lockedStart, lockedEnd }
    return {
      columnOrder: normalizeColumnOrder(columnIds, savedOrder, locks),
      movableIds: new Set(splitColumnIds(columnIds, locks).movable)
    }
  }, [isEnabled, columns, savedOrder, lockedStart, lockedEnd])

  const handleColumnOrderChange: OnChangeFn<ColumnOrderState> = (updater) =>
    setSavedOrder(functionalUpdate(updater, columnOrder))

  const isColumnMovable = (columnId: string) => movableIds.has(columnId)

  const startColumnDrag = (
    columnId: string,
    event: ReactMouseEvent<HTMLElement>
  ) => {
    const header = event.currentTarget
    const target = event.target as Element
    const isOwnTarget = header.contains(target)
    const row = header.parentElement
    if (
      event.button !== PRIMARY_BUTTON ||
      !isOwnTarget ||
      !row ||
      !movableIds.has(columnId) ||
      target.closest(NON_DRAG_TARGETS)
    ) {
      return
    }

    const startX = event.clientX
    let lastX = startX
    let order = columnOrder
    let isDragging = false

    const handleMove = (moveEvent: MouseEvent) => {
      const { clientX } = moveEvent
      if (!isDragging) {
        if (Math.abs(clientX - startX) < DRAG_START_THRESHOLD) {
          return
        }
        isDragging = true
        document.documentElement.classList.add(styles.columnDragging)
      }

      const direction = Math.sign(clientX - lastX)
      lastX = clientX
      scrollNearEdge(scrollContainerRef.current, clientX)

      const targetId = findHeaderColumnIdAt(row, clientX)
      if (!targetId || targetId === columnId || !movableIds.has(targetId)) {
        return
      }
      // Only move toward the pointer's travel direction; otherwise a narrow
      // column dragged over a wider one would swap back and forth every move.
      const step = Math.sign(order.indexOf(targetId) - order.indexOf(columnId))
      if (step !== direction) {
        return
      }
      order = moveColumnId(order, columnId, targetId)
      setSavedOrder(order)
    }

    const endDrag = () => {
      window.removeEventListener(DOM_EVENTS.MOUSEMOVE, handleMove)
      window.removeEventListener(DOM_EVENTS.MOUSEUP, handleUp)
      document.documentElement.classList.remove(styles.columnDragging)
      endDragRef.current = null
    }

    function handleUp() {
      endDrag()
      if (!isDragging) {
        return
      }
      suppressNextClick()
      if (order !== columnOrder) {
        onColumnOrderChange?.(order)
      }
    }

    endDragRef.current?.()
    endDragRef.current = endDrag
    window.addEventListener(DOM_EVENTS.MOUSEMOVE, handleMove)
    window.addEventListener(DOM_EVENTS.MOUSEUP, handleUp)
  }

  return {
    columnOrder,
    handleColumnOrderChange,
    isColumnMovable,
    startColumnDrag: isEnabled ? startColumnDrag : undefined
  }
}
