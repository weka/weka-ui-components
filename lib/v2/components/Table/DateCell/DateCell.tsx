import type { CellContext } from '@tanstack/react-table'
import type { TimestampInput } from '#v2/utils/timeUtils'

import { NOT_APPLICABLE } from '#v2/utils/consts'
import { formatTimestamp, toDateTime } from '#v2/utils/timeUtils'

import { Tooltip } from '../../Tooltip'

import styles from './dateCell.module.scss'

export type DateCellValue = TimestampInput

export interface DateCellOptions {
  format?: string
}

export function DateCell<TData>({
  cell,
  column
}: Readonly<CellContext<TData, DateCellValue>>) {
  const meta = column.columnDef.meta as
    | { cellOptions?: DateCellOptions }
    | undefined
  const cellOptions = meta?.cellOptions

  const value = cell.getValue()
  const dateTime = toDateTime(value)

  if (!dateTime) {
    return <span className={styles.dateCellEmpty}>{NOT_APPLICABLE}</span>
  }

  const formatted = cellOptions?.format
    ? dateTime.toFormat(cellOptions.format)
    : formatTimestamp(value)
  const fullDate = dateTime.toLocaleString({
    dateStyle: 'full',
    timeStyle: 'long'
  })

  return (
    <Tooltip data={fullDate}>
      <span className={styles.dateCell}>{formatted}</span>
    </Tooltip>
  )
}
