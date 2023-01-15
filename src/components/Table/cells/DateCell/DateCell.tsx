import React from 'react'
import { DateTime } from 'luxon'
import Tooltip from '../../../Tooltip'
import Utils from '../../../../utils'
import { CellProps } from 'react-table'

import './dateCell.scss'

function DateCell({ cell, column }: { cell: CellProps<object>, column: { [key: string]: any }}) {
  const { value } = cell
  const { showMili } = column
  return (
    <Tooltip data={DateTime.fromISO(value).toLocaleString({ dateStyle: 'full', timeStyle: 'long' })}>
      <div className='table-date-cell'>
        {Utils.formatISODate(value, showMili)}
      </div>
    </Tooltip>
  )
}

export default DateCell
