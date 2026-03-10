import React from 'react'
import type { ClearIndicatorProps } from 'react-select'
import { components } from 'react-select'

import { EMPTY_STRING } from 'consts'

import Tooltip from '../../../Tooltip'

interface ClearIndicatorProp extends ClearIndicatorProps {
  selectProps: any
}
function ClearIndicator(props: ClearIndicatorProp) {
  const { selectProps } = props

  return (
    <Tooltip data={selectProps.clearText || EMPTY_STRING}>
      <div>
        <components.ClearIndicator {...props} />
      </div>
    </Tooltip>
  )
}

export default ClearIndicator
