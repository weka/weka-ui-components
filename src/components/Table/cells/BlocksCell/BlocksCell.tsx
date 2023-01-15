import React from 'react'
import classNames from 'classnames'
import { CustomCellProps } from '../../Table'
import { DRIVES_STATUSES, NODES_STATUSES } from '../../../../consts'
import { CellValue } from 'react-table'

import './blocksCell.scss'

function BlocksCell({ cell }: CustomCellProps) {
  const { value } = cell
  const upBlocks = value.filter(({ status }: CellValue) => status === NODES_STATUSES.UP || status === DRIVES_STATUSES.ACTIVE
    || status === DRIVES_STATUSES.PHASING_OUT || status === DRIVES_STATUSES.PHASING_IN)
  return (
    <div className='blocks-cell'>
      <span className='table-count-cell'>{`${upBlocks.length}/${value.length}`}</span>
      <div className='blocks-wrapper'>
        {value.map(({ uid, status }: CellValue) => {
          const classes = classNames({
            block: true,
            [status]: true
          })
          return <div key={uid} className={classes} />
        })}
      </div>
    </div>
  )
}

export default BlocksCell
