import React, { useLayoutEffect, useMemo, useState } from 'react'
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

const TABLE_COUNT_CELL_HEIGHT = 16
const ROW_HEIGHT = 10 // 8px height + 2px margin
const BLOCK_WIDTH = 4 // 2px width + 2px margin
const ELLIPSIS_WIDTH_IN_BLOCKS = 4

function BlocksCell<Data>(props: ExtendedCellProps<Data, BlocksCellValue>) {
  const { cell, column, customValue } = props

  const cellDef = column.columnDef.meta?.cell
  if (cellDef && cellDef.type !== BlocksCellName) {
    throw new Error(`${BlocksCellName}: cell options type is incorrect`)
  }

  const value = customValue !== undefined ? customValue : cell.getValue()

  const { showTotalCountOnly, getUrl, openInNewTab } = cellDef?.options ?? {}

  const cellRef = React.useRef<HTMLDivElement>(null)
  const [maxBlocksCount, setMaxBlocksCount] = useState(0)

  const isUpBlock = ({ status }) =>
    status === NODES_STATUSES.UP ||
    status === DRIVES_STATUSES.ACTIVE ||
    status === DRIVES_STATUSES.PHASING_OUT ||
    status === DRIVES_STATUSES.PHASING_IN

  const upBlocks = value.filter((block) => isUpBlock(block))

  useLayoutEffect(() => {
    const cellElem = cellRef.current

    if (!cellElem) {
      return
    }

    const calculateMaxBlocksCount = () => {
      const cellElemClientRect = cellElem.getBoundingClientRect()

      const maxWidth = cellElemClientRect.width
      const maxHeight = cellElemClientRect.height - TABLE_COUNT_CELL_HEIGHT

      const maxBlocksColumns = Math.floor(maxWidth / BLOCK_WIDTH)
      const maxBlocksRows = Math.floor(maxHeight / ROW_HEIGHT)

      setMaxBlocksCount(maxBlocksColumns * maxBlocksRows)
    }

    calculateMaxBlocksCount()

    window.addEventListener('resize', calculateMaxBlocksCount)
    return () => {
      setMaxBlocksCount(0)
      window.removeEventListener('resize', calculateMaxBlocksCount)
    }
  }, [value])

  const shouldShowEllipsis = value.length > maxBlocksCount
  const valueToShow = shouldShowEllipsis
    ? value.slice(0, maxBlocksCount - ELLIPSIS_WIDTH_IN_BLOCKS)
    : value

  const sortedValue = useMemo(() => {
    return valueToShow.sort((a, b) => {
      if (isUpBlock(a) && !isUpBlock(b)) {
        return 1
      }

      if (!isUpBlock(a) && isUpBlock(b)) {
        return -1
      }

      return 0
    })
  }, [valueToShow])

  const cellContent = (
    <div className='blocks-cell' ref={cellRef}>
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
        {sortedValue.map(({ uid, id, status }) => {
          const classes = clsx({
            block: true,
            [status]: true
          })

          return <div key={uid ?? id} className={classes} />
        })}
        {shouldShowEllipsis && (
          <div className='blocks-ellipsis-wrapper'>
            <div className='blocks-ellipsis'>…</div>
          </div>
        )}
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
      className='blocks-cell-link-wrapper'
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {cellContent}
    </Link>
  ) : (
    <>{cellContent}</>
  )
}

export default BlocksCell
