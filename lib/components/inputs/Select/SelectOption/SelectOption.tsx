import React from 'react'
import { components, OptionProps } from 'react-select'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from '../../../../consts'

import './selectOption.scss'

interface SelectOptionProps extends OptionProps{
    data: any
}
function SelectOption(props: SelectOptionProps) {
  const { data: { label, icon, tooltip } } = props

  return (
    <components.Option {...props} className={icon ? 'has-icon' : EMPTY_STRING}>
      <Tooltip extraClass='option-tooltip' data={tooltip}>
        <div className='option-wrapper'>
          {icon}
          {label}
        </div>
      </Tooltip>
    </components.Option>
  )
}

export default SelectOption
