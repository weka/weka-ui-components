import type { CellContext } from '@tanstack/react-table'

import { Link } from 'react-router-dom'

import { COMMA_SEPARATOR, EMPTY_STRING } from '#v2/utils/consts'

import { Tooltip } from '../../Tooltip'

import styles from './defaultCell.module.scss'

export interface DefaultCellOptions<TData> {
  getUrl?: (values: TData) => string
  openInNewTab?: boolean
  tooltipText?:
    | string
    | ((cell: CellContext<TData, DefaultCellValue>) => string)
}

export type DefaultCellValue = string | number | string[] | null | undefined

const NEW_TAB_TARGET = '_blank'
const NEW_TAB_REL = 'noopener noreferrer'

function formatValue(value: DefaultCellValue): string {
  if (Array.isArray(value)) {
    return value.join(COMMA_SEPARATOR)
  }
  return value?.toString() ?? EMPTY_STRING
}

export function DefaultCell<TData>(
  props: Readonly<CellContext<TData, DefaultCellValue>>
) {
  const { cell, row, column } = props

  const meta = column.columnDef.meta as
    | { cellOptions?: DefaultCellOptions<TData> }
    | undefined
  const cellOptions = meta?.cellOptions

  const formattedValue = formatValue(cell.getValue())

  const {
    getUrl,
    openInNewTab,
    tooltipText: customTooltipText
  } = cellOptions ?? {}

  const customTooltip =
    typeof customTooltipText === 'function'
      ? customTooltipText(props)
      : customTooltipText

  const cellContent = <div className={styles.defaultCell}>{formattedValue}</div>

  if (customTooltip) {
    return (
      <Tooltip
        data={customTooltip}
        extraClass={styles.cellTooltip}
      >
        {getUrl ? (
          <Link
            className={styles.tableLink}
            onClick={(e) => e.stopPropagation()}
            to={getUrl(row.original)}
            {...(openInNewTab && {
              target: NEW_TAB_TARGET,
              rel: NEW_TAB_REL
            })}
          >
            {cellContent}
          </Link>
        ) : (
          cellContent
        )}
      </Tooltip>
    )
  }

  return (
    <Tooltip
      data={formattedValue}
      ellipsis
      ellipsisClass={styles.defaultCell}
      extraClass={styles.cellTooltip}
    >
      {getUrl ? (
        <Link
          className={styles.tableLink}
          onClick={(e) => e.stopPropagation()}
          to={getUrl(row.original)}
          {...(openInNewTab && {
            target: NEW_TAB_TARGET,
            rel: NEW_TAB_REL
          })}
        >
          {formattedValue}
        </Link>
      ) : (
        formattedValue
      )}
    </Tooltip>
  )
}
