import { Utils } from '../../../../../main'
import { EMPTY_STRING } from 'consts'
import { ExtendedCellProps, ExtendedColumn, ExtendedRow } from '../../../types'
import React from 'react'
import { Link } from 'react-router-dom'

export interface AggregatedTotalCellOptions<Data, Value> {
  getUrl?: (options: {
    row: ExtendedRow<Data>
    column: ExtendedColumn<Data, Value>
  }) => string
  openInNewTab?: boolean
}

export const AggregatedTotalCellName = 'AggregatedTotalCell'

function AggregatedTotalCell<Data, Value>(
  props: ExtendedCellProps<Data, Value>
) {
  const { row, column } = props

  const cellDef = column.columnDef.meta?.aggregatedCell
  if (cellDef && cellDef.type !== AggregatedTotalCellName) {
    throw new Error(
      `${AggregatedTotalCellName}: cell options are missing or the type is incorrect`
    )
  }

  const { getUrl, openInNewTab } = cellDef?.options ?? {}

  const count = row.getLeafRows().reduce<Set<unknown>>((acc, item) => {
    const value = item.getValue(column.id)

    if (!Utils.isEmpty(value)) {
      acc.add(value)
    }

    return acc
  }, new Set()).size

  const cellContent =
    typeof count === 'number' ? `${count} (total)` : EMPTY_STRING

  return (
    <>
      {getUrl ? (
        <Link
          to={getUrl({ row, column })}
          className='table-link'
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
