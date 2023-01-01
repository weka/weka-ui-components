import React, {ReactElement} from 'react'
import classNames from 'classnames'
import useToggle from '../../../hooks/useToggle'
import Utils from '../../../utils'
import Info from '../../Info/Info'

import './loginField.scss'

interface LoginFieldProps {
   onChange: (newVal: any) => void,
  value?:any,
  isRequired?: boolean,
  wrapperClass?: string,
  placeholder?: string,
  label: string | ReactElement,
  type?: string,
  tooltip?: any
  error?: any
}
function LoginField(props: LoginFieldProps) {
  const { label, onChange, value, error, placeholder, type, wrapperClass = '', tooltip, isRequired, ...rest } = props
  const [showPassword, toggleShowPassword] = useToggle(false)

  function onTextChange(event: React.KeyboardEvent) {
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
export default LoginField
