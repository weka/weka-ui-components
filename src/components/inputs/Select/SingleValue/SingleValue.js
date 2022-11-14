import React from 'react'
import propTypes from 'prop-types'
import { components } from 'react-select'

import './singleValue.scss'

function SingleValue(props) {
  const { data: { icon, label } } = props
  return (
    <components.SingleValue {...props}>
      {icon}
      <span className='react-select__single-value-label'>{label}</span>
    </components.SingleValue>
  )
}

SingleValue.propTypes = { data: propTypes.object.isRequired }

export default SingleValue
