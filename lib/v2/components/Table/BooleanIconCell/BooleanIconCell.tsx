import type { CellContext } from '@tanstack/react-table'

import { EMPTY_CONTENT } from '#consts'

import { VcheckGradientIcon } from '../../../icons'

import styles from './booleanIconCell.module.scss'

export type BooleanIconCellValue = boolean | null | undefined

export interface BooleanIconCellOptions {
  label?: string
}

const DEFAULT_TRUE_LABEL = 'Yes'

export function BooleanIconCell<TData>({
  cell,
  column
}: Readonly<CellContext<TData, BooleanIconCellValue>>) {
  const meta = column.columnDef.meta as
    | { cellOptions?: BooleanIconCellOptions }
    | undefined
  const cellOptions = meta?.cellOptions

  const value = cell.getValue()
  const label = cellOptions?.label ?? DEFAULT_TRUE_LABEL

  return (
    <div className={styles.booleanIconCell}>
      {value ? (
        <span
          aria-label={label}
          role='img'
        >
          <VcheckGradientIcon
            height={17}
            width={17}
          />
        </span>
      ) : (
        <span className={styles.booleanIconCellDash}>{EMPTY_CONTENT}</span>
      )}
    </div>
  )
}
