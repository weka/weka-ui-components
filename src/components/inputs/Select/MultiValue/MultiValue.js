import React from 'react'
import { components } from 'react-select'
import propTypes from 'prop-types'
import Tooltip from '../../../Tooltip'

import './multiValue.scss'

function MultiValue(props) {
  const { data: { label } } = props
  return (
    <components.MultiValue {...props}>
      <Tooltip data={label} placement='left'>
        <span>
          {label}
        </span>
      </Tooltip>
    </components.MultiValue>
  )
}

MultiValue.propTypes = { data: propTypes.object.isRequired }

export default MultiValue
