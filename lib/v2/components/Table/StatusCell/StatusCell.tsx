import type { StatusCellValue, StatusVariant } from './statusUtils'
import type { CellContext } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'

import { VcheckFillIcon } from '../../../icons'
import { Tooltip } from '../../Tooltip'
import { getStatusVariant, STATUS_VARIANTS } from './statusUtils'

import styles from './statusCell.module.scss'

const STATUS_DOT_CLASS: Record<StatusVariant, string> = {
  [STATUS_VARIANTS.UP]: styles.statusDotUp,
  [STATUS_VARIANTS.WORKING]: styles.statusDotWorking,
  [STATUS_VARIANTS.DEGRADED]: styles.statusDotDegraded,
  [STATUS_VARIANTS.DOWN]: styles.statusDotDown,
  [STATUS_VARIANTS.INFO]: styles.statusDotInfo
}

export interface StatusCellOptions<TRow = unknown> {
  /**
   * `row` is the full row data, for classification that depends on more than
   * the cell's own value (e.g. a derived status combining two fields).
   * Existing single-argument classifiers keep working unchanged.
   */
  classify?: (status: StatusCellValue, row?: TRow) => StatusVariant
  formatLabel?: (status: string) => string
}

function renderStatusIndicator(variant: StatusVariant): ReactNode {
  if (variant === STATUS_VARIANTS.UP) {
    return (
      <VcheckFillIcon
        extraClass={styles.statusCheckIcon}
        height={18}
        width={18}
      />
    )
  }

  if (variant === STATUS_VARIANTS.WORKING) {
    return <span className={styles.statusSpinner} />
  }

  return <span className={clsx(styles.statusDot, STATUS_DOT_CLASS[variant])} />
}

export function StatusCell<TData>({
  cell,
  column,
  row
}: Readonly<CellContext<TData, StatusCellValue>>) {
  const meta = column.columnDef.meta as
    | { cellOptions?: StatusCellOptions<TData> }
    | undefined
  const cellOptions = meta?.cellOptions

  const value = cell.getValue()
  const variant =
    cellOptions?.classify?.(value, row.original) ?? getStatusVariant(value)
  const label = value
    ? cellOptions?.formatLabel?.(value) ?? value.replace(/_/g, ' ')
    : EMPTY_STRING

  return (
    <span className={styles.statusCellAlign}>
      <Tooltip data={label}>
        <div className={styles.statusCell}>
          {renderStatusIndicator(variant)}
        </div>
      </Tooltip>
    </span>
  )
}
