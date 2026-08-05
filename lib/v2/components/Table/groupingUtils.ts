import type { Cell, Row } from '@tanstack/react-table'

import { EMPTY_STRING } from '#v2/utils/consts'

export const GROUPED_CELL_MODES = {
  GROUP: 'group',
  AGGREGATED: 'aggregated',
  PLACEHOLDER: 'placeholder',
  VALUE: 'value'
} as const

export type GroupedCellMode =
  (typeof GROUPED_CELL_MODES)[keyof typeof GROUPED_CELL_MODES]

/**
 * Classifies how a cell should render while grouping is active: the group
 * header itself, a roll-up of its leaf rows, a duplicate of the group value
 * that must stay blank, or a plain leaf value.
 */
export function getGroupedCellMode<TData>(
  cell: Cell<TData, unknown>
): GroupedCellMode {
  if (cell.getIsGrouped()) {
    return GROUPED_CELL_MODES.GROUP
  }
  if (cell.getIsAggregated()) {
    return GROUPED_CELL_MODES.AGGREGATED
  }
  if (cell.getIsPlaceholder()) {
    return GROUPED_CELL_MODES.PLACEHOLDER
  }
  return GROUPED_CELL_MODES.VALUE
}

function isEmptyCellValue(value: unknown): boolean {
  if (value === null || value === undefined || value === EMPTY_STRING) {
    return true
  }
  return Array.isArray(value) && value.length === 0
}

/**
 * Counts the distinct non-empty values a column holds across a grouped row's
 * leaf rows — the roll-up number shown in aggregated cells.
 */
export function getGroupUniqueCount<TData>(
  row: Row<TData>,
  columnId: string
): number {
  const uniqueValues = new Set<unknown>()

  row.getLeafRows().forEach((leafRow) => {
    const value = leafRow.getValue(columnId)
    if (!isEmptyCellValue(value)) {
      uniqueValues.add(
        typeof value === 'object' ? JSON.stringify(value) : value
      )
    }
  })

  return uniqueValues.size
}
