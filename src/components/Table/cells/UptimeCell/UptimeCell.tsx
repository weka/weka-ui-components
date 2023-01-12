import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { Tooltip } from '@weka.io/weka-ui-components'
import Utils from '../../../../utils/utils'

import './uptimeCell.scss'

function getMinTimeDiff(value) {
  const fullTime = Utils.getTimeDiffString(value)
  const splitTime = fullTime.split(' ')
  if (splitTime[0] !== '0d') {
    return { value: splitTime[0], exactValue: splitTime.join(' ') }
  }
  if (splitTime[1] !== '0h') {
    return { value: splitTime[1], exactValue: splitTime.slice(1).join(' ') }
  }
  return { value: splitTime[2], exactValue: splitTime[2] }
}

function UptimeCell({ cell }) {
  const { value } = cell
  const [uptime, setUptime] = useState(getMinTimeDiff(value).value)
  const [exactUptime, setExactUptime] = useState(getMinTimeDiff(value).exactValue)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setUptime(getMinTimeDiff(value).value)
      setExactUptime(getMinTimeDiff(value).exactValue)
    }, 10 * 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [value])
  return (
    <Tooltip data={exactUptime}>
      <div className='uptime-cell'>
        {uptime}
      </div>
    </Tooltip>

  )
}

UptimeCell.propTypes = { cell: propTypes.object.isRequired }

export default UptimeCell
