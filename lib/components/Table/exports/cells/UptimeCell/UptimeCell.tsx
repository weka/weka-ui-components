import React, { useEffect, useState } from 'react'

import Utils from 'utils'

import Tooltip from '../../../../Tooltip'
import type { ExtendedCellProps } from '../../../types'

export type UptimeCellValue = string

function getMinTimeDiff(value: string) {
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

function UptimeCell<Data>({
  cell,
  customValue
}: ExtendedCellProps<Data, UptimeCellValue>) {
  const value = customValue !== undefined ? customValue : cell.getValue()

  const [uptime, setUptime] = useState(getMinTimeDiff(value).value)
  const [exactUptime, setExactUptime] = useState(
    getMinTimeDiff(value).exactValue
  )
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
      <div>{uptime}</div>
    </Tooltip>
  )
}

export default UptimeCell
