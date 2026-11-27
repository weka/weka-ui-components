import type { ColumnOrderState } from '@tanstack/react-table'

/**
 * Opts a table into drag-and-drop column reordering. Locked columns are
 * counted in column-definition order, so a long table only has to say how many
 * columns at each edge stay put rather than list every movable one.
 */
export interface ColumnReorderConfig {
  /** Leading columns that cannot be moved and that no column can move before. */
  lockedStart?: number
  /** Trailing columns that cannot be moved and that no column can move after. The row actions column is always locked. */
  lockedEnd?: number
}

interface ColumnOrderLocks {
  lockedStart: number
  lockedEnd: number
}

/** Splits definition-ordered column ids into the locked leading, movable and locked trailing ranges. */
export function splitColumnIds(
  columnIds: string[],
  { lockedStart, lockedEnd }: ColumnOrderLocks
) {
  const movableEnd = Math.max(lockedStart, columnIds.length - lockedEnd)
  return {
    start: columnIds.slice(0, lockedStart),
    movable: columnIds.slice(lockedStart, movableEnd),
    end: columnIds.slice(movableEnd)
  }
}

/**
 * Builds a full column order from a saved one. Locked columns keep their
 * definition position; saved movable ids keep their saved order; ids that are
 * unknown or no longer movable are dropped, and movable columns missing from
 * the saved order (e.g. added since it was saved) go at the end of the movable
 * range.
 */
export function normalizeColumnOrder(
  columnIds: string[],
  savedOrder: ColumnOrderState,
  locks: ColumnOrderLocks
): ColumnOrderState {
  const { start, movable, end } = splitColumnIds(columnIds, locks)
  const movableIds = new Set(movable)
  const orderedMovable = [
    ...new Set(savedOrder.filter((id) => movableIds.has(id)))
  ]
  const orderedSet = new Set(orderedMovable)
  const unsaved = movable.filter((id) => !orderedSet.has(id))
  return [...start, ...orderedMovable, ...unsaved, ...end]
}

/** Moves `columnId` to the position currently held by `targetId`. */
export function moveColumnId(
  order: ColumnOrderState,
  columnId: string,
  targetId: string
): ColumnOrderState {
  const fromIndex = order.indexOf(columnId)
  const toIndex = order.indexOf(targetId)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return order
  }
  const next = order.filter((id) => id !== columnId)
  next.splice(toIndex, 0, columnId)
  return next
}
