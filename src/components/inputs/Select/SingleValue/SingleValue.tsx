import React from 'react'
import { components, SingleValueProps } from 'react-select'
import SpanTooltip from '../../../SpanTooltip'

import './singleValue.scss'
interface ValueProps extends SingleValueProps{
    data: any
}
function SingleValue(props:ValueProps) {
  const { data: { icon, label } } = props
  return (
    <components.SingleValue {...props}>
      {icon}
      <SpanTooltip extraClasses='react-select__single-value-label'>{label}</SpanTooltip>
    </components.SingleValue>
  )
}


export default SingleValue
