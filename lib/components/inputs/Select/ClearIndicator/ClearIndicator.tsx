import type { ClearIndicatorProps } from 'react-select'

import React from 'react'
import { components } from 'react-select'
import { EMPTY_STRING } from '#consts'

import Tooltip from '../../../Tooltip'

function ClearIndicator(props: ClearIndicatorProps<Option, boolean>) {
  // `clearText` is a custom prop callers pass through to react-select
  const { selectProps } = props
  const { clearText } = selectProps as { clearText?: string }

  return (
    <Tooltip data={clearText || EMPTY_STRING}>
      <div>
        <components.ClearIndicator {...props} />
      </div>
    </Tooltip>
  )
}

export default ClearIndicator
