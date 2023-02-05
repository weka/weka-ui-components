import React from 'react'
import { DateTime } from 'luxon'
import Tooltip from '../../../Tooltip'
import Utils from '../../../../utils'
import { CellProps } from 'react-table'

import './dateCell.scss'

function DateCell({ cell, column }: { cell: CellProps<object>, column: { [key: string]: any }}) {
  const { value } = cell
  const { showMili, showRelative } = column
  const valueToDate = DateTime.fromISO(value)
  return (
    <Tooltip data={valueToDate.toLocaleString({ dateStyle: 'full', timeStyle: 'long' })}>
      <div className='table-date-cell'>
        {showRelative ? valueToDate.toRelative() : Utils.formatISODate(value, showMili)}
      </div>
    </Tooltip>
  )
}

export default DateCell
