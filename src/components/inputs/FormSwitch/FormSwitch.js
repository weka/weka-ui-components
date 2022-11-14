import React from 'react'
import propTypes from 'prop-types'
import Tooltip from '../../Tooltip'
import Switch from '../../Switch'
import { EMPTY_STRING } from '../../../consts'
import { Info } from '../../../svgs'

import './FormSwitch.scss'

// eslint-disable-next-line no-unused-vars,react/prop-types
function FormSwitch({ onChange, oneColor, value, label, placeholder, isRequired, info, ...rest }) {
  return (
    <div className='form-switch'>
      <div>
        <span className='form-switch-label'>
          {label}
        </span>
        {info && (
          <Tooltip data={info}>
            <Info className='form-switch-info' />
          </Tooltip>
        )}
      </div>

      <Switch onChange={onChange} oneColor={oneColor} checked={value || placeholder || false} {...rest} />
    </div>
  )
}

FormSwitch.defaultProps = { oneColor: false, value: false, placeholder: false, disabled: false, info: EMPTY_STRING }

FormSwitch.propTypes = {
  label: propTypes.string.isRequired,
  info: propTypes.string,
  onChange: propTypes.func.isRequired,
  oneColor: propTypes.bool,
  disabled: propTypes.bool,
  value: propTypes.bool,
  placeholder: propTypes.bool
}

export default FormSwitch
