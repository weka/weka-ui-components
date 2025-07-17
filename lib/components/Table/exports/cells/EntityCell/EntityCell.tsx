import React from 'react'
import Tooltip from '../../../../Tooltip'
import svgs from 'svgs'
import { ORIGIN_OPTIONS } from 'consts'
import { ExtendedCellProps } from '../../../types'

import './entityCell.scss'

const { User, Weka } = svgs

export type EntityCellValue = string

function EntityCell<Data>(props: ExtendedCellProps<Data, EntityCellValue>) {
  const { cell, customValue } = props

  const value = customValue !== undefined ? customValue : cell.getValue()

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
