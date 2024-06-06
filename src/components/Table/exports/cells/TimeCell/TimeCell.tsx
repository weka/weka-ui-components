import React from 'react'
import { Duration } from 'luxon'
import Tooltip from '../../../../Tooltip'
import { EMPTY_STRING, TIME_PARTS_SHORTENINGS } from '../../../../../consts'
import { ExtendedCellProps } from '../../../../Table/types'

export type TimeCellValue = number

function TimeCell<Data>(props: ExtendedCellProps<Data, TimeCellValue>) {
  const { cell, customValue } = props

  const value = customValue !== undefined ? customValue : cell.getValue()

  const durationObj = Duration.fromMillis(value * 1000)
    .shiftTo('months', 'weeks', 'days', 'hours', 'minutes', 'seconds')
    .toObject()
  let wholeStringToShow = EMPTY_STRING
  let partStringToShow = EMPTY_STRING
  const durationObjWithValues: { [key: string]: any } = {}
  Object.entries(durationObj).forEach(([key, val]) => {
    if (val) {
      durationObjWithValues[key] = val
      wholeStringToShow += `${val}${TIME_PARTS_SHORTENINGS[key]} `
    }
  })
  Object.entries(durationObjWithValues).forEach(([key, val], index) => {
    if (index < 2) {
      partStringToShow += `${val}${TIME_PARTS_SHORTENINGS[key]} `
    }
  })

  return (
    <Tooltip data={wholeStringToShow}>
      <div>{value ? partStringToShow : EMPTY_STRING}</div>
    </Tooltip>
  )
}

export default TimeCell
