import React from 'react'
import classNames from 'classnames'
import Tooltip from '../../../Tooltip'
import { SEVERITIES_ICONS } from '../../../../consts'
import { CustomCellProps } from '../../Table'

import './severityCell.scss'

function SeverityCell({ cell }: CustomCellProps) {
  const { value } = cell
  const Icon = SEVERITIES_ICONS[value]
  const classes = classNames({
    'event-severity': true,
    [value.toLowerCase()]: true
  })
  return (
    <Tooltip data={value} placement='right'>
      <div className={classes}>
        {Icon ? <Icon /> : value}
      </div>
    </Tooltip>
  )
}

export default SeverityCell
