import React from 'react'
import { StatusOk, Propeller, Ellipses, FullWarning, StatusError } from 'svgs'
import { DRIVES_STATUSES, STATUS } from 'consts'
import Tooltip from '../../../../Tooltip'
import { ExtendedCellProps } from '../../../types'

import './statusCell.scss'

export interface StatusCellOptions<Data> {
  getTooltip?: (rowValues: Data) => string
  showString?: boolean
}

export type StatusCellValue = string | null

function getIcon(status: StatusCellValue) {
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

export const StatusCellName = 'StatusCell'

function StatusCell<Data>(props: ExtendedCellProps<Data, StatusCellValue>) {
  const { cell, row, customValue } = props

  const cellDef = cell.column.columnDef?.meta?.cell
  if (cellDef && cellDef.type !== StatusCellName) {
    throw new Error(`${StatusCellName}: cell options type is incorrect`)
  }

  const value = customValue !== undefined ? customValue : cell.getValue()

  const { getTooltip, showString } = cellDef?.options ?? {}

  const noUnderscoreValue = value?.replaceAll('_', ' ')
  const tooltip = getTooltip ? getTooltip(row.original) : noUnderscoreValue

  return (
    <Tooltip data={tooltip}>
      <div className='status-cell-wrapper'>
        {getIcon(value)}
        {showString && (
          <span className='status-string'>{noUnderscoreValue}</span>
        )}
      </div>
    </Tooltip>
  )
}

export default StatusCell
