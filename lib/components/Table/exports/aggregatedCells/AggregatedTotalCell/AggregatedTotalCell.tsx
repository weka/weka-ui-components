import React from 'react'
import { Link } from 'react-router-dom'

import { EMPTY_STRING } from 'consts'

import { getUniqueCount } from '../../../tableUtils'
import type {
  ExtendedCellProps,
  ExtendedColumn,
  ExtendedRow
} from '../../../types'

export interface AggregatedTotalCellOptions<Data, Value> {
  getUrl?: (options: {
    row: ExtendedRow<Data>
    column: ExtendedColumn<Data, Value>
  }) => string
  openInNewTab?: boolean
}

export const AggregatedTotalCellName = 'AggregatedTotalCell'

function AggregatedTotalCell<Data, Value>({
  row,
  column
}: ExtendedCellProps<Data, Value>) {
  const cellDef = column.columnDef.meta?.aggregatedCell
  if (cellDef && cellDef.type !== AggregatedTotalCellName) {
    throw new Error(
      `${AggregatedTotalCellName}: cell options are missing or the type is incorrect`
    )
  }

  const { getUrl, openInNewTab } = cellDef?.options ?? {}

  const count = getUniqueCount(row, column.id)

  const cellContent =
    typeof count === 'number' ? `${count} (total)` : EMPTY_STRING

  return (
    <>
      {getUrl ? (
        <Link
          className='table-link'
          to={getUrl({ row, column })}
          {...(openInNewTab && {
            target: '_blank',
            rel: 'noopener noreferrer'
          })}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {cellContent}
        </Link>
      ) : (
        cellContent
      )}
    </>
  )
}

export default AggregatedTotalCell
