import React, { useRef, useState, useEffect } from 'react'
import Tooltip from '../../../../Tooltip'
import { COLUMN_RESIZING_LISTENER, EMPTY_STRING } from '../../../../../consts'
import Utils from '../../../../../utils'
import { Link } from 'react-router-dom'
import { ExtendedCell, ExtendedCellProps } from '../../../types'

import './defaultCell.scss'

export interface DefaultCellOptions<Data, Value> {
  getUrl?: (values: Data) => string
  openInNewTab?: boolean
  tooltipText?: string | ((cell: ExtendedCell<Data, Value>) => string)
}

export type DefaultCellValue = string | number | string[] | null | undefined

export const DefaultCellName = 'DefaultCell'

function DefaultCell<Data>(props: ExtendedCellProps<Data, DefaultCellValue>) {
  const { cell, row, column, customValue } = props

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
    tooltipText: customTooltipText
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
    <div className='table-default-cell' ref={ref}>
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
          to={getUrl(row.original)}
          className='table-link'
          {...(openInNewTab && {
            target: '_blank',
            rel: 'noopener noreferrer'
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

export default DefaultCell
