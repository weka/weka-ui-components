import React from 'react'
import { DateTime } from 'luxon'
import Tooltip from '../../../Tooltip'
import Utils from '../../../../utils'
import { CellProps } from 'react-table'
import { TIME_FORMATS } from '../../../../consts'
import clsx from 'clsx'

import './dateCell.scss'

function DateCell({
  cell,
  column
}: {
  cell: CellProps<object>
  column: { [key: string]: any }
}) {
  const { value } = cell
  const defaultCustomFormat = column?.showMili
    ? TIME_FORMATS.DATE_TIME_SECONDS_MS
    : TIME_FORMATS.DATE_TIME_SECONDS
  const {
    showMili,
    showRelative,
    relativeOnly,
    enableCustomFormat = false,
    customFormat = defaultCustomFormat
  } = column
  const valueToDate = DateTime.fromISO(value)
  const valueToShow = enableCustomFormat
    ? valueToDate.toFormat(customFormat)
    : Utils.formatISODate(value, showMili)

  const getDateString = () => {
    if (relativeOnly) {
      return valueToDate.toRelative()
    }
    if (showRelative) {
      return (
        <>
          <span>{valueToShow}</span>
          <span className='relative-time'>{` (${valueToDate.toRelative()})`}</span>
        </>
      )
    }
    return valueToShow
  }

  const dateCellClasses = clsx({
    'table-date-cell': true,
    'table-date-cell-regular': !showRelative,
    'table-date-cell-with-relative': showRelative
  })

  return (
    <Tooltip
      data={valueToDate.toLocaleString({
        dateStyle: 'full',
        timeStyle: 'long'
      })}
    >
      <div className={dateCellClasses}>{getDateString()}</div>
    </Tooltip>
  )
}

export default DateCell
