import type { Cell } from '@tanstack/react-table'
import type { CSSProperties, ReactNode } from 'react'

import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'

import { getGroupedCellMode, GROUPED_CELL_MODES } from '../groupingUtils'
import { GroupExpander } from './GroupExpander'
import { ROW_ACTIONS_COLUMN_ID } from './tableConsts'

import styles from './table.module.scss'

interface TableBodyCellProps<TData> {
  readonly cell: Cell<TData, unknown>
  readonly isGrouped: boolean
  readonly firstDataColumnId?: string
}

/**
 * Renders a body `<td>`. While grouping is active the cell switches between the
 * group header (with its expander), the column's aggregated roll-up, a blank
 * placeholder, and the plain leaf value.
 */
export function TableBodyCell<TData>({
  cell,
  isGrouped,
  firstDataColumnId
}: Readonly<TableBodyCellProps<TData>>) {
  const cellMeta = cell.column.columnDef.meta as
    | { cellStyle?: CSSProperties }
    | undefined

  const renderColumnCell = () =>
    flexRender(cell.column.columnDef.cell, cell.getContext())

  const renderContent = (): ReactNode => {
    if (!isGrouped) {
      return renderColumnCell()
    }

    switch (getGroupedCellMode(cell)) {
      case GROUPED_CELL_MODES.GROUP:
        return (
          <span className={styles.groupCell}>
            <GroupExpander row={cell.row} />
            <span className={styles.groupCellValue}>{renderColumnCell()}</span>
          </span>
        )
      case GROUPED_CELL_MODES.AGGREGATED:
        return flexRender(
          cell.column.columnDef.aggregatedCell,
          cell.getContext()
        )
      case GROUPED_CELL_MODES.PLACEHOLDER:
        return null
      default:
        return renderColumnCell()
    }
  }

  return (
    <td
      style={{ width: cell.column.getSize(), ...cellMeta?.cellStyle }}
      className={clsx(styles.tableCell, {
        [styles.stickyActions]: cell.column.id === ROW_ACTIONS_COLUMN_ID,
        [styles.stickyFirst]: cell.column.id === firstDataColumnId
      })}
    >
      {renderContent()}
    </td>
  )
}
