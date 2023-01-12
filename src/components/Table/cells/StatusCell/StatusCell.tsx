import React from 'react'
import propTypes from 'prop-types'
import { Tooltip } from '@weka.io/weka-ui-components'
import SVGS from '../../../../static/svgs'
import { DRIVES_STATUES, STATUS } from '../../../../utils/consts'

import './statusCell.scss'

function getIcon(status) {
  switch (status) {
    case STATUS.OK:
    case STATUS.UP:
    case STATUS.READY:
    case STATUS.ACTIVE:
    case STATUS.ENABLED:
      return <SVGS.StatusOk className='up' />
    case STATUS.UPDATING:
      return <SVGS.Ellipses className='updating' />
    case STATUS.CREATING:
      return <SVGS.Propeller className='working' />
    case STATUS.REMOVING:
      return <SVGS.Propeller className='working' />
    case STATUS.DEGRADED:
      return <SVGS.FullWarning className='degraded-status' />
    case STATUS.DOWNLOADING:
    case STATUS.DEACTIVATING:
    case DRIVES_STATUES.PHASING_IN:
    case DRIVES_STATUES.PHASING_OUT:
      return <SVGS.Propeller className='working' />
    default:
      return <SVGS.StatusError className='down' />
  }
}

function StatusCell({ cell }) {
  const { value, column: { getTooltip, showString }, row } = cell
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

StatusCell.propTypes = { cell: propTypes.object.isRequired }

export default StatusCell
