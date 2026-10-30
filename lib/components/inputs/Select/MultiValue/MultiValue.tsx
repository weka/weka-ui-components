import type { MultiValueProps } from 'react-select'

import React from 'react'
import { components } from 'react-select'

import Tooltip from '../../../Tooltip'

function MultiValue(props: MultiValueProps<Option, boolean>) {
  const {
    data: { chipLabel, chipTooltip, label }
  } = props
  return (
    <components.MultiValue {...props}>
      <Tooltip
        data={chipTooltip || label}
        placement='left'
      >
        <span>{chipLabel || label}</span>
      </Tooltip>
    </components.MultiValue>
  )
}

export default MultiValue
