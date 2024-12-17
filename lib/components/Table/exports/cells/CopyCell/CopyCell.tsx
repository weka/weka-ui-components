import React from 'react'
import Copy from '../../../../Copy'
import { ExtendedCellProps } from '../../../types'
import { CircularProgress } from '@mui/material'

import './copyCell.scss'

export type CopyCellValue = string | undefined

export const CopyCellName = 'CopyCell'

export interface CopyCellOptions<Data> {
  isLoading?: boolean | ((values: Data) => boolean)
}

function CopyCell<Data>(props: ExtendedCellProps<Data, CopyCellValue>) {
  const { cell, column, row, customValue } = props
  const value = customValue !== undefined ? customValue : cell.getValue()

  const cellDef = column.columnDef.meta?.cell
  if (cellDef && cellDef.type !== CopyCellName) {
    throw new Error(
      `${CopyCellName}: cell options are missing or the type is incorrect`
    )
  }
  const { isLoading } = cellDef?.options ?? {}
  const showLoading =
    isLoading instanceof Function ? isLoading(row.original) : isLoading

  return (
    <div className='copy-cell'>
      <span>{value}</span>
      {value && <Copy text={value} />}
      {showLoading && <CircularProgress size={14} />}
    </div>
  )
}

export default CopyCell
