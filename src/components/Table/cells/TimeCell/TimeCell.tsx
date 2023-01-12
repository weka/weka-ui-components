import React from 'react'
import propTypes from 'prop-types'
import { Duration } from 'luxon'
import { Tooltip } from '@weka.io/weka-ui-components'
import { EMPTY_STRING, TIME_PARTS_SHORTENINGS } from '../../../../utils/consts'

import './timeCell.scss'

function TimeCell({ cell }) {
  const { value } = cell

  const durationObj = Duration.fromMillis(value * 1000)
    .shiftTo('months', 'weeks', 'days', 'hours', 'minutes', 'seconds').toObject()
  let wholeStringToShow = EMPTY_STRING
  let partStringToShow = EMPTY_STRING
  const durationObjWithValues = {}
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
      <div>
        {value ? partStringToShow : EMPTY_STRING}
      </div>
    </Tooltip>
  )
}

TimeCell.propTypes = { cell: propTypes.object.isRequired }

export default TimeCell
