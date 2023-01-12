import React from 'react'
import propTypes from 'prop-types'
import { CapacityBar } from '@weka.io/weka-ui-components'

import './barCell.scss'

function BarCell({ cell }) {
  const { value } = cell
  return (
    <div className='bar-cell'>
      <span className='table-count-cell'>{`${value}%`}</span>
      <CapacityBar firstUsage={value / 100} firstColor='var(--accent-key)' />
    </div>
  )
}

BarCell.propTypes = { cell: propTypes.object.isRequired }

export default BarCell
