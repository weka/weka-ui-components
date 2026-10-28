import type { ReactElement } from 'react'
import type { MultiValueProps } from 'react-select'

import React from 'react'
import { components } from 'react-select'

import Tooltip from '../../../Tooltip'

type ChipOption = Option &
  Partial<{
    chipLabel: string | ReactElement
    chipTooltip: string | ReactElement
  }>

function MultiValue(props: MultiValueProps<Option, boolean>) {
  const { data } = props
  const { chipLabel, chipTooltip, label } = data as ChipOption
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
