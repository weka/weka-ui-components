import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import Tooltip from '../Tooltip'
import { EMPTY_STRING } from '../../consts'

import './switch.scss'

function Switch(props) {
  const { onChange, oneColor, checked, disabled, tooltip, ...rest } = props
  const classes = classNames({
    'one-color': oneColor,
    'toggle-btn': true,
    disabled
  })

  function onClick(val) { // we cant put disabled on the input becasue to tooltip wont work
    if (!disabled) {
      onChange(val)
    }
  }

  return (
    <Tooltip data={tooltip}>
      <div className={classes}>
        <input type='checkbox' checked={checked} onChange={onClick} {...rest} />
        <span />
      </div>
    </Tooltip>
  )
}

Switch.defaultProps = { oneColor: false, disabled: false, tooltip: EMPTY_STRING }

Switch.propTypes = {
  onChange: propTypes.func.isRequired,
  disabled: propTypes.bool,
  oneColor: propTypes.bool,
  checked: propTypes.bool.isRequired,
  tooltip: propTypes.string
}

export default Switch
