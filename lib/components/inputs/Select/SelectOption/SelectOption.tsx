import React from 'react'
import { components, OptionProps } from 'react-select'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from '~consts'

import './selectOption.scss'

interface SelectOptionProps extends OptionProps {
  data: {
    label: string
    icon?: React.ReactNode
    tooltip?: string
    subLabel?: string
  }
}
function SelectOption(props: SelectOptionProps) {
  const {
    data: { label, icon, tooltip, subLabel }
  } = props

  return (
    <components.Option {...props} className={icon ? 'has-icon' : EMPTY_STRING}>
      <Tooltip extraClass='option-tooltip' data={tooltip}>
        <div className='option-wrapper'>
          <div>{icon}</div>
          <div>
            <div>{label}</div>
            {subLabel && <div className='label-4 sub-label'>{subLabel}</div>}
          </div>
        </div>
      </Tooltip>
    </components.Option>
  )
}

export default SelectOption
