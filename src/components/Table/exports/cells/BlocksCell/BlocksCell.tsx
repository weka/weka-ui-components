import React from 'react'
import clsx from 'clsx'
import { DRIVES_STATUSES, NODES_STATUSES } from '../../../../../consts'
import { Link } from 'react-router-dom'

import './blocksCell.scss'
import { ExtendedCellProps } from '../../../types'

export interface BlocksCellOptions<Data> {
  showTotalCountOnly?: boolean
  isLink?: boolean
  getUrl?: (values: Data) => string
  openInNewTab?: boolean
}

export type BlocksCellValue = {
  uid: string
  id: string
  status: string
}[]

export const BlocksCellName = 'BlocksCell'

function BlocksCell<Data>(props: ExtendedCellProps<Data, BlocksCellValue>) {
  const { cell, column, customValue } = props

  const cellDef = column.columnDef.meta?.cell
  if (cellDef && cellDef.type !== BlocksCellName) {
    throw new Error(`${BlocksCellName}: cell options type is incorrect`)
  }

  const value = customValue !== undefined ? customValue : cell.getValue()

  const { showTotalCountOnly, getUrl, openInNewTab } = cellDef?.options ?? {}

  const upBlocks = value.filter(
    ({ status }) =>
      status === NODES_STATUSES.UP ||
      status === DRIVES_STATUSES.ACTIVE ||
      status === DRIVES_STATUSES.PHASING_OUT ||
      status === DRIVES_STATUSES.PHASING_IN
  )

  const cellContent = (
    <div className='blocks-cell'>
      <span
        className={clsx({
          'table-count-cell': true,
          'table-count-cell-is-link': getUrl
        })}
      >
        {showTotalCountOnly ?? !value.length
          ? value.length
          : `${upBlocks.length}/${value.length}`}
      </span>
      <div className='blocks-wrapper'>
        {value.map(({ uid, id, status }) => {
          const classes = clsx({
            block: true,
            [status]: true
          })

          return <div key={uid ?? id} className={classes} />
        })}
      </div>
    </div>
  )

  return getUrl ? (
    <Link
      to={getUrl(cell.row.original)}
      {...(openInNewTab && {
        target: '_blank',
        rel: 'noopener noreferrer'
      })}
    >
      {cellContent}
    </Link>
  ) : (
    <>{cellContent}</>
  )
}

export default BlocksCell
