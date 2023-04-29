import React from 'react'
import classNames from 'classnames'
import { CustomCellProps } from '../../Table'
import { DRIVES_STATUSES, NODES_STATUSES } from '../../../../consts'
import { CellValue } from 'react-table'

import './blocksCell.scss'

function BlocksCell<Data extends Record<string, unknown>>({
  cell,
  column
}: CustomCellProps<Data>) {
  const { value } = cell
  const { showTotalCountOnly } = column

  const upBlocks = value.filter(
    ({ status }: CellValue) =>
      status === NODES_STATUSES.UP ||
      status === DRIVES_STATUSES.ACTIVE ||
      status === DRIVES_STATUSES.PHASING_OUT ||
      status === DRIVES_STATUSES.PHASING_IN
  )

  return (
    <div className='blocks-cell'>
      <span className='table-count-cell'>
        {showTotalCountOnly ?? !value.length
          ? value.length
          : `${upBlocks.length}/${value.length}`}
      </span>
      <div className='blocks-wrapper'>
        {value.map(({ uid, id, status }: CellValue) => {
          const classes = classNames({
            block: true,
            [status]: true
          })

          return <div key={uid ?? id} className={classes} />
        })}
      </div>
    </div>
  )
}

export default BlocksCell
