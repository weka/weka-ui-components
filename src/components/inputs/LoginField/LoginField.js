import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { EMPTY_STRING } from '../../../consts'
import useToggle from '../../../hooks/useToggle'
import Utils from '../../../utils'
import Info from '../../Info/Info'

import './loginField.scss'

function LoginField(props) {
  const { label, onChange, value, error, placeholder, type, wrapperClass, tooltip, isRequired, ...rest } = props
  const [showPassword, toggleShowPassword] = useToggle(false)

  function onTextChange(event) {
    onChange(!Number.isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : event.target.value)
  }

  const wrapperClasses = classNames({
    [wrapperClass]: true,
    'login-text-field': true,
    'has-error': !!error
  })

  const inputClasses = classNames({
    'login-field-input': true,
    'is-type-password-login': type === 'password'
  })

  return (
    <div className={wrapperClasses}>
      <span className='login-field-label'>
        <span className='body-copy-1'>{label}</span>
        {isRequired && <span className='required-star'>*</span>}
        {tooltip ? <Info data={tooltip} /> : null }
      </span>
      <input
        autoComplete='new-password'
        className={inputClasses}
        placeholder={placeholder}
        type={showPassword && type === 'password' ? 'text' : type}
        value={value}
        onChange={onTextChange}
        {...rest}
      />
      {type === 'password'
          && (
            <span className='login-password-icon'>
              {Utils.getPasswordIcon(showPassword, toggleShowPassword)}
            </span>
          )}
      <span className='text-login-error capitalize-first-letter'>{error}</span>
    </div>
  )
}

LoginField.defaultProps = {
  onChange: () => {
  },
  value: EMPTY_STRING,
  error: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  wrapperClass: EMPTY_STRING,
  isRequired: false,
  label: EMPTY_STRING,
  type: EMPTY_STRING,
  tooltip: EMPTY_STRING

}

LoginField.propTypes = {
  onChange: propTypes.func,
  value: propTypes.any,
  isRequired: propTypes.bool,
  wrapperClass: propTypes.string,
  placeholder: propTypes.string,
  label: propTypes.oneOfType([propTypes.string, propTypes.object]),
  type: propTypes.string,
  tooltip: propTypes.oneOfType([propTypes.string, propTypes.element]),
  error: propTypes.any
}

export default LoginField
