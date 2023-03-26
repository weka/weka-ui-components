import React from 'react'
import Tooltip from '../../../Tooltip'
import { User, Weka } from '../../../../svgs'
import { ORIGIN_OPTIONS } from '../../../../consts'
import { CustomCellProps } from '../../Table'

import './entityCell.scss'

function EntityCell({ cell }: CustomCellProps) {
  const { value } = cell
  const Icon = value === ORIGIN_OPTIONS.USER ? User : Weka

  return (
    <div className='events-entity-cell'>
      <Tooltip data={value}>
        <span className='events-entity-cell-wrapper'>
          <Icon />
        </span>
      </Tooltip>
    </div>
  )
}

export default EntityCell
