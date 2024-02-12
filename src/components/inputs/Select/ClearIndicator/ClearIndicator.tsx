import React from 'react'
import { components, ClearIndicatorProps } from 'react-select'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from '../../../../consts'

interface ClearIndicatorProp extends ClearIndicatorProps {
  selectProps: any
}
function ClearIndicator(props: ClearIndicatorProp) {
  const { selectProps } = props

  const isOnlyUnremovableSelected =
    Array.isArray(selectProps.value) &&
    selectProps.value.every((option: Option) => option.isUnremovable)

  return (
    !isOnlyUnremovableSelected && (
      <Tooltip data={selectProps.clearText || EMPTY_STRING}>
        <div>
          <components.ClearIndicator {...props} />
        </div>
      </Tooltip>
    )
  )
}

export default ClearIndicator
