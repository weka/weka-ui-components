import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

import { COLUMN_RESIZING_LISTENER, EMPTY_STRING } from 'consts'
import Utils from 'utils'

import Tooltip from '../../../../Tooltip'
import type { ExtendedCell, ExtendedCellProps } from '../../../types'

import './defaultCell.scss'

export interface DefaultCellOptions<Data, Value> {
  getUrl?: (values: Data) => string
  openInNewTab?: boolean
  tooltipText?: string | ((cell: ExtendedCell<Data, Value>) => string)
  isMultiline?: boolean
}

export type DefaultCellValue = string | number | string[] | null | undefined

export const DefaultCellName = 'DefaultCell'

function DefaultCell<Data>({
  cell,
  row,
  column,
  customValue
}: ExtendedCellProps<Data, DefaultCellValue>) {
  const cellDef = column.columnDef.meta?.cell
  if (cellDef && cellDef.type !== DefaultCellName) {
    throw new Error(
      `${DefaultCellName}: cell options are missing or the type is incorrect`
    )
  }

  const value = customValue !== undefined ? customValue : cell.getValue()

  const formattedValue = Array.isArray(value)
    ? value.join(', ')
    : value?.toString() ?? EMPTY_STRING

  const {
    getUrl,
    openInNewTab,
    tooltipText: customTooltipText,
    isMultiline = false
  } = cellDef?.options ?? {}

  const ref = useRef<null | HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState(EMPTY_STRING)

  useEffect(() => {
    const compareSize = () => {
      if (ref.current && Utils.isEllipsisActive(ref.current)) {
        setTooltip(formattedValue)
      } else {
        setTooltip(EMPTY_STRING)
      }
    }

    compareSize()
    window.addEventListener('resize', compareSize)
    document.addEventListener(COLUMN_RESIZING_LISTENER, compareSize)
    return () => {
      window.removeEventListener('resize', compareSize)
      document.removeEventListener(COLUMN_RESIZING_LISTENER, compareSize)
    }
  }, [formattedValue])

  const cellContent = (
    <div
      ref={ref}
      className={clsx({
        'table-default-cell-one-line': !isMultiline
      })}
    >
      {formattedValue}
    </div>
  )

  return (
    <Tooltip
      data={
        customTooltipText instanceof Function
          ? customTooltipText(cell)
          : customTooltipText ?? tooltip
      }
    >
      {getUrl ? (
        <Link
          className='table-link'
          to={getUrl(row.original)}
          {...(openInNewTab && {
            target: '_blank',
            rel: 'noopener noreferrer'
          })}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {cellContent}
        </Link>
      ) : (
        cellContent
      )}
    </Tooltip>
  )
}

export default DefaultCell
