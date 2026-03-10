import React from 'react'
import type { SingleValueProps } from 'react-select'
import { components } from 'react-select'

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
        additionalData={subLabel}
        extraClasses='react-select__single-value-label'
      >
        {label}
      </SpanTooltip>
    </components.SingleValue>
  )
}

export default SingleValue
