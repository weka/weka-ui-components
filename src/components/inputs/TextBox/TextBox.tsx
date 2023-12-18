import React, { ReactElement, ChangeEvent } from 'react'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING } from '../../../consts'
import useToggle from '../../../hooks/useToggle'
import Utils from '../../../utils'
import { Info } from '../../../svgs'

import './textBox.scss'
import { useAutosizeWidth } from './hooks'

interface TextBoxProps {
  onChange: (newVal: any) => void
  value: string | number
  wrapperClass?: string
  placeholder?: string | number
  label?: string | ReactElement
  tooltip?: string | ReactElement
  error?: any
  Icon?: ReactElement
  type?: string
  isRequired?: boolean
  info?: any
  allowDecimal?: boolean
  autosize?: boolean
  maxLength?: number
}

const TextBox = React.forwardRef(function TextBox(props: TextBoxProps, ref) {
  const {
    label = EMPTY_STRING,
    onChange,
    value = EMPTY_STRING,
    error,
    placeholder,
    wrapperClass = '',
    tooltip,
    Icon,
    type,
    info,
    isRequired,
    allowDecimal,
    autosize,
    ...rest
  } = props
  const [showPassword, toggleShowPassword] = useToggle(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    if (!Number.isNaN(event.target.valueAsNumber)) {
      onChange(event.target.valueAsNumber >= 0 ? event.target.valueAsNumber : 0)
    } else {
      onChange(event.target.value)
    }
  }

  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'text-box-field': true,
    'has-error': !!error,
    'no-label': !label,
    'has-icon': !!Icon
  })

  const inputClasses = clsx({
    field__input: true,
    'is-type-password': type === 'password'
  })

  const { inputWidth, calculationBoxRef } = useAutosizeWidth({
    autosize,
    value,
    inputRef
  })

  return (
    <Tooltip data={tooltip}>
      <div
        className={wrapperClasses}
        style={autosize ? { width: `${inputWidth}px` } : {}}
      >
        {autosize && (
          <div ref={calculationBoxRef} className='calculation-box'>
            {value}
          </div>
        )}
        {Icon && <Icon className='text-box-icon' />}
        <input
          onKeyDown={(e) => {
            if (
              type === 'number' &&
              (e.key === 'e' ||
                e.key === 'E' ||
                e.key === '-' ||
                e.key === '+' ||
                (!allowDecimal && e.key === '.'))
            ) {
              e.preventDefault()
            }
          }}
          step='any'
          autoComplete='new-password'
          className={inputClasses}
          placeholder={placeholder}
          value={value === null ? EMPTY_STRING : value}
          onChange={onTextChange}
          ref={(node) => {
            inputRef.current = node

            if (ref) {
              if (typeof ref === 'function') {
                ref(node)
              } else {
                ref.current = node
              }
            }
          }}
          type={showPassword && type === 'password' ? 'text' : type}
          {...rest}
        ></input>
        {type === 'password' && (
          <span className='password-icon'>
            {Utils.getPasswordIcon(showPassword, toggleShowPassword)}
          </span>
        )}
        <span className='field__label-wrap'>
          <span className='field__label field-1-label-content'>
            {label}
            {isRequired && <span className='required-star'>*</span>}
            {!!info && (
              <Tooltip data={info}>
                <Info />
              </Tooltip>
            )}
          </span>
        </span>
        <span className='text-box-error capitalize-first-letter'>{error}</span>
      </div>
    </Tooltip>
  )
})
export default TextBox
