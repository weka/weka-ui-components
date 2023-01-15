import React from 'react'
import CapacityBar from '../../../CapacityBar'
import { CustomCellProps } from '../../Table'

import './barCell.scss'

function BarCell({ cell }: CustomCellProps) {
  const { value } = cell
  return (
    <div className='bar-cell'>
      <span className='table-count-cell'>{`${value}%`}</span>
      <CapacityBar firstUsage={value / 100} firstColor='var(--accent-key)' />
    </div>
  )
}

export default BarCell
