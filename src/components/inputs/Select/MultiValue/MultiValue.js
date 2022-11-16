import React from 'react'
import { components } from 'react-select'
import propTypes from 'prop-types'
import Tooltip from '../../../Tooltip'

import './multiValue.scss'

function MultiValue(props) {
  const { data: { chipLabel, chipTooltip, label } } = props
  return (
    <components.MultiValue {...props}>
      <Tooltip data={chipTooltip || label} placement='left'>
        <span>
          {chipLabel || label}
        </span>
      </Tooltip>
    </components.MultiValue>
  )
}

MultiValue.propTypes = { data: propTypes.object.isRequired }

export default MultiValue
