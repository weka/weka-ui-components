import type { StatusCellValue, StatusVariant } from './statusUtils'
import type { CellContext } from '@tanstack/react-table'

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
  [STATUS_VARIANTS.DOWN]: styles.statusDotDown
}

export interface StatusCellOptions {
  classify?: (status: StatusCellValue) => StatusVariant
  formatLabel?: (status: string) => string
}

export function StatusCell<TData>({
  cell,
  column
}: Readonly<CellContext<TData, StatusCellValue>>) {
  const meta = column.columnDef.meta as
    | { cellOptions?: StatusCellOptions }
    | undefined
  const cellOptions = meta?.cellOptions

  const value = cell.getValue()
  const variant = cellOptions?.classify?.(value) ?? getStatusVariant(value)
  const label = value
    ? cellOptions?.formatLabel?.(value) ?? value.replace(/_/g, ' ')
    : EMPTY_STRING

  if (variant === STATUS_VARIANTS.UP) {
    return (
      <Tooltip data={label}>
        <div className={styles.statusCell}>
          <VcheckFillIcon
            extraClass={styles.statusCheckIcon}
            height={18}
            width={18}
          />
        </div>
      </Tooltip>
    )
  }

  if (variant === STATUS_VARIANTS.WORKING) {
    return (
      <Tooltip data={label}>
        <div className={styles.statusCell}>
          <span className={styles.statusSpinner} />
        </div>
      </Tooltip>
    )
  }

  return (
    <Tooltip data={label}>
      <div className={styles.statusCell}>
        <span className={clsx(styles.statusDot, STATUS_DOT_CLASS[variant])} />
      </div>
    </Tooltip>
  )
}
