import React from 'react'
import { components, SingleValueProps } from 'react-select'
import SpanTooltip from '../../../SpanTooltip'

import './singleValue.scss'

interface ValueProps extends SingleValueProps {
  data: {
    label: string
    icon?: React.ReactNode
    subLabel?: string
  }
}

function SingleValue(props: ValueProps) {
  const {
    data: { icon, label, subLabel }
  } = props
  return (
    <components.SingleValue {...props}>
      {icon}
      <SpanTooltip
        extraClasses='react-select__single-value-label'
        additionalData={subLabel}
      >
        {label}
      </SpanTooltip>
    </components.SingleValue>
  )
}

export default SingleValue
