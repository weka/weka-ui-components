import React from 'react'
import propTypes from 'prop-types'
import { components } from 'react-select'
import SpanTooltip from '../../../SpanTooltip'

import './singleValue.scss'

function SingleValue(props) {
  const { data: { icon, label } } = props
  return (
    <components.SingleValue {...props}>
      {icon}
      <SpanTooltip extraClasses='react-select__single-value-label'>{label}</SpanTooltip>
    </components.SingleValue>
  )
}

SingleValue.propTypes = { data: propTypes.object.isRequired }

export default SingleValue
