import React from 'react'
import { StatusOk, Propeller, Ellipses, FullWarning, StatusError } from '../../../../svgs'
import { DRIVES_STATUSES, STATUS } from '../../../../consts'
import { ColumnInstance } from 'react-table'
import { CustomCellProps } from '../../Table'
import Tooltip from '../../../Tooltip'

import './statusCell.scss'

interface ExtendedColumn extends ColumnInstance {
  getTooltip?: (original: object) => string
  showString?: boolean
}

function getIcon(status: string) {
  switch (status) {
    case STATUS.OK:
    case STATUS.UP:
    case STATUS.READY:
    case STATUS.ACTIVE:
    case STATUS.ENABLED:
      return <StatusOk className='up' />
    case STATUS.UPDATING:
      return <Ellipses className='updating' />
    case STATUS.CREATING:
      return <Propeller className='working' />
    case STATUS.REMOVING:
    case STATUS.ADDING:
      return <Propeller className='working' />
    case STATUS.DEGRADED:
      return <FullWarning className='degraded-status' />
    case STATUS.DOWNLOADING:
    case STATUS.DEACTIVATING:
    case DRIVES_STATUSES.PHASING_IN:
    case DRIVES_STATUSES.PHASING_OUT:
      return <Propeller className='working' />
    default:
      return <StatusError className='down' />
  }
}

function StatusCell({ cell }: CustomCellProps) {
  const { value, column, row } = cell
  const { getTooltip, showString } = column as ExtendedColumn
  const noUnderscoreValue = value?.replaceAll('_', ' ')
  const tooltip = getTooltip ? getTooltip(row.original) : noUnderscoreValue

  return (
    <Tooltip data={tooltip}>
      <div className='status-cell-wrapper'>
        {getIcon(value)}
        {showString && <span className='status-string'>{noUnderscoreValue}</span>}
      </div>
    </Tooltip>
  )
}

export default StatusCell
