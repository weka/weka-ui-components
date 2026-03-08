import React from 'react'

import CapacityBar from '../../../../CapacityBar'
import type { ExtendedCellProps } from '../../../types'

import './barCell.scss'

export type BarCellValue = number

function BarCell<Data>({
  cell,
  customValue
}: ExtendedCellProps<Data, BarCellValue>) {
  const value = customValue !== undefined ? customValue : cell.getValue()

  return (
    <div className='bar-cell'>
      <span className='table-count-cell'>{`${value}%`}</span>
      <CapacityBar
        firstColor='var(--accent-key)'
        firstUsage={value / 100}
      />
    </div>
  )
}

export default BarCell
