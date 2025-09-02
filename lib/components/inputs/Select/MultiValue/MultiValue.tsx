import React from 'react'
import { components, MultiValueProps } from 'react-select'
import Tooltip from '../../../Tooltip'

interface ValueProps extends MultiValueProps {
  data: any
}
function MultiValue(props: ValueProps) {
  const {
    data: { chipLabel, chipTooltip, label }
  } = props
  return (
    <components.MultiValue {...props}>
      <Tooltip data={chipTooltip || label} placement='left'>
        <span>{chipLabel || label}</span>
      </Tooltip>
    </components.MultiValue>
  )
}

export default MultiValue
