import React from 'react'
import { DateTime } from 'luxon'
import Tooltip from '../../../Tooltip'
import Utils from '../../../../utils'
import { CellProps } from 'react-table'
import classNames from 'classnames'

import './dateCell.scss'

function DateCell({ cell, column }: { cell: CellProps<object>, column: { [key: string]: any }}) {
  const { value } = cell
  const { showMili, showRelative, relativeOnly } = column
  const valueToDate = DateTime.fromISO(value)

  const getDateString = () => {
    if (relativeOnly) {
      return valueToDate.toRelative()
    }
    if (showRelative) {
      return (
        <>
          <span>{Utils.formatISODate(value, showMili)}</span>
          <span className='relative-time'>{` (${valueToDate.toRelative()})`}</span>
        </>
      )
    }
    return Utils.formatISODate(value, showMili)
  }

  const dateCellClasses = classNames({
    'table-date-cell': !showRelative,
    'table-date-cell-with-relative': showRelative
  })

  return (
    <Tooltip data={valueToDate.toLocaleString({ dateStyle: 'full', timeStyle: 'long' })}>
      <div className={dateCellClasses}>
        {getDateString()}
      </div>
    </Tooltip>
  )
}

export default DateCell
