import React from 'react'
import clsx from 'clsx'
import Tooltip from '../../../../Tooltip'
import { SEVERITIES_ICONS, EMPTY_STRING } from 'consts'
import { ExtendedCellProps } from '../../../types'

import './severityCell.scss'

export type SeverityCellValue = string

interface SeverityCellProps<Data>
  extends ExtendedCellProps<Data, SeverityCellValue> {
  extraClass?: string
}

function SeverityCell<Data>(props: SeverityCellProps<Data>) {
  const { cell, customValue, extraClass = EMPTY_STRING } = props

  const value = customValue !== undefined ? customValue : cell.getValue()

  const Icon = SEVERITIES_ICONS[value]
  const classes = clsx('event-severity', value.toLowerCase(), extraClass)
  return (
    <Tooltip data={value} placement='right'>
      <div className={classes}>{Icon ? <Icon /> : value}</div>
    </Tooltip>
  )
}

export default SeverityCell
