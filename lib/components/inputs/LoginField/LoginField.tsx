import React, { ReactElement } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from '~consts'
import { useToggle } from '~hooks'
import Utils from '~utils'
import Info from '../../Info/Info'

import './loginField.scss'

interface LoginFieldProps {
  onChange: (newVal: string | number) => void
  value?: string | number
  isRequired?: boolean
  wrapperClass?: string
  placeholder?: string
  label: string | ReactElement
  type?: string
  tooltip?: any
  error?: any
}
function LoginField(props: LoginFieldProps) {
  const {
    label,
    onChange,
    value = EMPTY_STRING,
    error,
    placeholder,
    type,
    wrapperClass = EMPTY_STRING,
    tooltip,
    isRequired,
    ...rest
  } = props

  const [showPassword, toggleShowPassword] = useToggle(false)

  function onTextChange(event: React.KeyboardEvent<HTMLInputElement>) {
    onChange(
      !Number.isNaN(event.target.valueAsNumber)
        ? event.target.valueAsNumber
        : event.target.value
    )
  }

  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'login-text-field': true,
    'has-error': !!error
  })

  const inputClasses = clsx({
    'login-field-input': true,
    'is-type-password-login': type === 'password'
  })

  return (
    <div className={wrapperClasses}>
      <span className='login-field-label'>
        <span className='body-copy-1'>{label}</span>
        {isRequired && <span className='required-star'>*</span>}
        {tooltip ? <Info data={tooltip} /> : null}
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
      {type === 'password' && (
        <span className='login-password-icon'>
          {Utils.getPasswordIcon(showPassword, toggleShowPassword)}
        </span>
      )}
      <span className='text-login-error capitalize-first-letter'>{error}</span>
    </div>
  )
}
export default LoginField
