import React from 'react'
import clsx from 'clsx'
import Tooltip from '../../../../Tooltip'
import { SEVERITIES_ICONS } from '../../../../../consts'
import { ExtendedCellProps } from '../../../types'

import './severityCell.scss'

export type SeverityCellValue = string

function SeverityCell<Data>(props: ExtendedCellProps<Data, SeverityCellValue>) {
  const { cell, customValue } = props

  const value = customValue !== undefined ? customValue : cell.getValue()

  const Icon = SEVERITIES_ICONS[value]
  const classes = clsx({
    'event-severity': true,
    [value.toLowerCase()]: true
  })
  return (
    <Tooltip data={value} placement='right'>
      <div className={classes}>{Icon ? <Icon /> : value}</div>
    </Tooltip>
  )
}

export default SeverityCell
