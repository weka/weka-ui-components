import React from 'react'
import propTypes from 'prop-types'
import { Radio } from '@mui/material'
import classNames from 'classnames'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING } from '../../../consts'
import { Info } from '../../../svgs'

import './radioSwitch.scss'

function RadioSwitch({ label, checked, onChange, value, disabled, info }) {
  function onRadioChange(event) {
    onChange(event.target.value)
  }

  const cls = classNames({
    disabled,
    'radio-switch': true
  })

  return (
    <div className={cls}>
      <Radio
        classes={{ root: 'radio-btn' }}
        checked={checked}
        disabled={disabled}
        onChange={onRadioChange}
        value={value}
      />
      <span className='radio-label'>
        {label}
        {!!info && <Tooltip data={info}><Info /></Tooltip>}
      </span>
    </div>
  )
}

RadioSwitch.defaultProps = {
  disabled: false,
  info: EMPTY_STRING
}

RadioSwitch.propTypes = {
  label: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
  checked: propTypes.bool.isRequired,
  onChange: propTypes.func.isRequired,
  disabled: propTypes.bool,
  info: propTypes.string
}

export default RadioSwitch
