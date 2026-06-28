import type { CapacityFillColor } from '../../CapacityProgressBar'
import type { CellContext } from '@tanstack/react-table'

import {
  CAPACITY_FILL_COLORS,
  CapacityProgressBar
} from '../../CapacityProgressBar'
import { Tooltip } from '../../Tooltip'

import styles from './progressCell.module.scss'

export type ProgressCellValue = number | null | undefined

export interface ProgressCellOptions<TData> {
  fillColor?: CapacityFillColor
  height?: number
  minWidth?: number
  tooltip?: string | ((cell: CellContext<TData, ProgressCellValue>) => string)
}

const DEFAULT_FILL = CAPACITY_FILL_COLORS.CYAN
const DEFAULT_HEIGHT = 22
const DEFAULT_MIN_WIDTH = 140

export function ProgressCell<TData>(
  props: Readonly<CellContext<TData, ProgressCellValue>>
) {
  const { cell, column } = props
  const meta = column.columnDef.meta as
    | { cellOptions?: ProgressCellOptions<TData> }
    | undefined
  const cellOptions = meta?.cellOptions

  const value = cell.getValue()

  if (value == null) {
    return <span className={styles.progressCellEmpty}>—</span>
  }

  const fillColor = cellOptions?.fillColor ?? DEFAULT_FILL
  const height = cellOptions?.height ?? DEFAULT_HEIGHT
  const minWidth = cellOptions?.minWidth ?? DEFAULT_MIN_WIDTH
  const tooltip =
    typeof cellOptions?.tooltip === 'function'
      ? cellOptions.tooltip(props)
      : cellOptions?.tooltip

  const bar = (
    <div
      className={styles.progressCell}
      style={{ minWidth }}
    >
      <CapacityProgressBar
        extraClass={styles.progressBar}
        fillColor={fillColor}
        height={height}
        percentage={value}
        showPercentageText
      />
    </div>
  )

  if (tooltip) {
    return <Tooltip data={tooltip}>{bar}</Tooltip>
  }

  return bar
}
