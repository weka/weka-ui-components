import React from 'react'

import { ORIGIN_OPTIONS } from 'consts'
import svgs from 'svgs'

import Tooltip from '../../../../Tooltip'
import type { ExtendedCellProps } from '../../../types'

import './entityCell.scss'

const { User, Weka } = svgs

export type EntityCellValue = string

function EntityCell<Data>({
  cell,
  customValue
}: ExtendedCellProps<Data, EntityCellValue>) {
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
