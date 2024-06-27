import React from 'react'
import CapacityBar from '../../../../CapacityBar'

import './barCell.scss'
import { ExtendedCellProps } from '../../../types'

export type BarCellValue = number

function BarCell<Data>(props: ExtendedCellProps<Data, BarCellValue>) {
  const { cell, customValue } = props

  const value = customValue !== undefined ? customValue : cell.getValue()

  return (
    <div className='bar-cell'>
      <span className='table-count-cell'>{`${value}%`}</span>
      <CapacityBar firstUsage={value / 100} firstColor='var(--accent-key)' />
    </div>
  )
}

export default BarCell
