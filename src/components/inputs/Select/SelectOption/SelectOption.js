import React from 'react'
import propTypes from 'prop-types'
import { components } from 'react-select'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from '../../../../consts'

import './selectOption.scss'

function SelectOption(props) {
  const { data: { label, icon, tooltip } } = props

  return (
    <components.Option {...props} className={icon ? 'has-icon' : EMPTY_STRING}>
      <Tooltip extraClass='option-tooltip' data={tooltip}>
        <div>
          {icon}
          {label}
        </div>
      </Tooltip>
    </components.Option>
  )
}

SelectOption.propTypes = { data: propTypes.object.isRequired }

export default SelectOption
