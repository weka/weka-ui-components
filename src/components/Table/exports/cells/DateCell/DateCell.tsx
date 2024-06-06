import React from 'react'
import { DateTime } from 'luxon'
import Tooltip from '../../../../Tooltip'
import Utils from '../../../../../utils'
import { TIME_FORMATS } from '../../../../../consts'
import clsx from 'clsx'
import { ExtendedCellProps } from '../../../types'

import './dateCell.scss'

export interface DateCellOptions {
  showMili?: boolean
  showRelative?: boolean
  relativeOnly?: boolean
  enableCustomFormat?: boolean
  customFormat?: string
}

export type DateCellValue = string

export const DateCellName = 'DateCell'

function DateCell<Data>(props: ExtendedCellProps<Data, DateCellValue>) {
  const { cell, column, customValue } = props

  const cellDef = column.columnDef.meta?.cell
  if (cellDef && cellDef.type !== DateCellName) {
    throw new Error(
      `${DateCellName}: cell options are missing or the type is incorrect`
    )
  }

  const value = customValue !== undefined ? customValue : cell.getValue()

  const defaultCustomFormat = cellDef?.options.showMili
    ? TIME_FORMATS.DATE_TIME_SECONDS_MS
    : TIME_FORMATS.DATE_TIME_SECONDS

  const {
    showMili,
    showRelative,
    relativeOnly,
    enableCustomFormat = false,
    customFormat = defaultCustomFormat
  } = cellDef?.options ?? {}

  const valueToDate = DateTime.fromISO(value)
  const valueToShow = enableCustomFormat
    ? valueToDate.toFormat(customFormat)
    : Utils.formatISODate(value, showMili)

  const formattedRelative = Utils.getRelativeTimeFromISODate(value, true)

  const getDateString = () => {
    if (relativeOnly) {
      return formattedRelative
    }
    if (showRelative) {
      return (
        <>
          <span>{valueToShow}</span>
          <span className='relative-time'>{` (${formattedRelative})`}</span>
        </>
      )
    }
    return valueToShow
  }

  const dateCellClasses = clsx({
    'table-date-cell': true,
    'table-date-cell-regular': !showRelative
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
