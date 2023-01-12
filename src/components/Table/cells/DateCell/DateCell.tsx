import React from 'react'
import propTypes from 'prop-types'
import { DateTime } from 'luxon'
import { Tooltip } from '@weka.io/weka-ui-components'
import Utils from '../../../utils/utils'

import './dateCell.scss'

function DateCell({ cell, column }) {
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

DateCell.propTypes = {
  cell: propTypes.object.isRequired,
  column: propTypes.object.isRequired
}

export default DateCell
