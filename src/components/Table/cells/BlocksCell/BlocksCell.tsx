import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { DRIVES_STATUES, NODES_STATUES } from '../../../../utils/consts'

import './blocksCell.scss'

function BlocksCell({ cell }) {
  const { value } = cell
  const upBlocks = value.filter(({ status }) => status === NODES_STATUES.UP || status === DRIVES_STATUES.ACTIVE
    || status === DRIVES_STATUES.PHASING_OUT || status === DRIVES_STATUES.PHASING_IN)
  return (
    <div className='blocks-cell'>
      <span className='table-count-cell'>{`${upBlocks.length}/${value.length}`}</span>
      <div className='blocks-wrapper'>
        {value.map(({ uid, status }) => {
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

BlocksCell.propTypes = { cell: propTypes.object.isRequired }

export default BlocksCell
