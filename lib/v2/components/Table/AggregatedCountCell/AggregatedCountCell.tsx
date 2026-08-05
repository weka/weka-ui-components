import type { CellContext } from '@tanstack/react-table'

import { getGroupUniqueCount } from '../groupingUtils'

import styles from './aggregatedCountCell.module.scss'

const TOTAL_LABEL = '(total)'

/**
 * Default renderer for aggregated (grouped) cells: the number of distinct
 * values the column holds across the group's leaf rows, e.g. `4 (total)`.
 */
export function AggregatedCountCell<TData>({
  row,
  column
}: Readonly<CellContext<TData, unknown>>) {
  const count = getGroupUniqueCount(row, column.id)

  return (
    <span className={styles.aggregatedCountCell}>
      {count} {TOTAL_LABEL}
    </span>
  )
}
