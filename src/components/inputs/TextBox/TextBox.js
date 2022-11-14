import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING } from '../../../consts'
import useToggle from '../../../hooks/useToggle'
import Utils from '../../../utils'
import { Info } from '../../../svgs'

import './textBox.scss'

const TextBox = React.forwardRef((props, ref) => {
  const { label, onChange, value, error, placeholder, wrapperClass, tooltip, Icon, type, info, isRequired, allowDecimal, ...rest } = props
  const [showPassword, toggleShowPassword] = useToggle(false)

  function onTextChange(event) {
    if (!Number.isNaN(event.target.valueAsNumber)) {
      onChange(event.target.valueAsNumber >= 0 ? event.target.valueAsNumber : 0)
    } else {
      onChange(event.target.value)
    }
  }

  const wrapperClasses = classNames({
    [wrapperClass]: true,
    'text-box-field': true,
    'has-error': !!error,
    'no-label': !label,
    'has-icon': !!Icon
  })

  const inputClasses = classNames({
    field__input: true,
    'is-type-password': type === 'password'
  })

  return (
    <Tooltip data={tooltip}>
      <div className={wrapperClasses}>
        {Icon && <Icon className='text-box-icon' />}
        <input
          onKeyDown={(e) => {
            if (type === 'number' && (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+' || (!allowDecimal && e.key === '.'))) {
              e.preventDefault()
            }
          }}
          step='any'
          autoComplete='new-password'
          className={inputClasses}
          placeholder={placeholder}
          value={value === null ? EMPTY_STRING : value}
          onChange={onTextChange}
          ref={ref}
          type={showPassword && type === 'password' ? 'text' : type}
          {...rest}
        />
        {type === 'password'
          && (
            <span className='password-icon'>
              {Utils.getPasswordIcon(showPassword, toggleShowPassword)}
            </span>
          )}
        <span className='field__label-wrap'>
          <span className='field__label field-1-label-content'>
            {label}
            {isRequired && <span className='required-star'>*</span>}
            {!!info && <Tooltip data={info}><Info /></Tooltip>}
          </span>
        </span>
        <span className='text-box-error capitalize-first-letter'>{error}</span>
      </div>
    </Tooltip>
  )
})

TextBox.defaultProps = {
  onChange: () => {},
  value: EMPTY_STRING,
  error: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  wrapperClass: EMPTY_STRING,
  label: EMPTY_STRING,
  tooltip: EMPTY_STRING,
  Icon: null,
  type: EMPTY_STRING,
  isRequired: false,
  info: EMPTY_STRING,
  allowDecimal: false
}

TextBox.propTypes = {
  onChange: propTypes.func,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  wrapperClass: propTypes.string,
  placeholder: propTypes.oneOfType([propTypes.string, propTypes.number]),
  label: propTypes.oneOfType([propTypes.string, propTypes.object]),
  tooltip: propTypes.oneOfType([propTypes.string, propTypes.element]),
  error: propTypes.any,
  Icon: propTypes.any,
  type: propTypes.string,
  isRequired: propTypes.bool,
  info: propTypes.any,
  allowDecimal: propTypes.bool
}

export default TextBox
