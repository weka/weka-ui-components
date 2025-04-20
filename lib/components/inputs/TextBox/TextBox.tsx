import React, { ReactElement, ChangeEvent, useEffect, useState } from 'react'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING, EVENT_KEYS } from 'consts'
import { useHighlightInput, useToggle } from '../../../hooks'
import Utils from 'utils'
import { Info } from 'svgs'
import { useAutosizeWidth } from './hooks'
import InputLoader from '../../InputLoader'

import './textBox.scss'

interface TextBoxProps {
  onChange: (newVal: string | number) => void
  value: string | number
  wrapperClass?: string
  placeholder?: string | number
  label?: string | ReactElement
  tooltip?: string | ReactElement
  passwordTooltip?: string | ReactElement
  error?: string | ReactElement
  Icon?: ReactElement
  type?: string
  isRequired?: boolean
  info?: string | ReactElement
  allowDecimal?: boolean
  allowNegative?: boolean
  autosize?: boolean
  maxLength?: number
  autofill?: boolean
  getAsyncDefaultValue?: () => Promise<string>
  isHighlighted?: boolean
  isScrolledInto?: boolean
}

const TextBox = React.forwardRef(function TextBox(props: TextBoxProps, ref) {
  const {
    label = EMPTY_STRING,
    onChange,
    value = EMPTY_STRING,
    error,
    placeholder,
    wrapperClass = EMPTY_STRING,
    tooltip,
    passwordTooltip,
    Icon,
    type,
    info,
    isRequired,
    allowDecimal,
    autosize,
    autofill,
    allowNegative,
    getAsyncDefaultValue,
    isHighlighted,
    isScrolledInto,
    ...rest
  } = props
  const [showPassword, toggleShowPassword] = useToggle(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const textBoxRef = React.useRef<HTMLInputElement | null>(null)
  const [isLoadingValue, setLoadingValue] = useState(false)
  const isAsync = !!getAsyncDefaultValue
  const highlighted = useHighlightInput({
    inputRef: textBoxRef,
    isHighlighted,
    isScrolledInto
  })

  useEffect(() => {
    if (isAsync) {
      setLoadingValue(true)
      getAsyncDefaultValue().then((defaultValue) => {
        onChange(defaultValue ?? EMPTY_STRING)
        setLoadingValue(false)
      })
    }
  }, [])

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    if (!Number.isNaN(event.target.valueAsNumber)) {
      onChange(
        allowNegative || event.target.valueAsNumber >= 0
          ? event.target.valueAsNumber
          : 0
      )
    } else {
      onChange(event.target.value)
    }
  }

  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'text-box-field': true,
    'has-error': !!error,
    'no-label': !label,
    'has-icon': !!Icon,
    'is-highlighted': highlighted
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
        ref={textBoxRef}
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
                (!(allowNegative && value.toString().length === 0) &&
                  e.key === '-') ||
                e.key === '+' ||
                (!allowDecimal && e.key === EVENT_KEYS.DOT))
            ) {
              e.preventDefault()
            }
            if (
              (e.key === EVENT_KEYS.TAB || e.key === EVENT_KEYS.ARROW_RIGHT) &&
              autofill &&
              placeholder
            ) {
              e.preventDefault()
              onChange(placeholder)
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
            {Utils.getPasswordIcon(
              showPassword,
              toggleShowPassword,
              passwordTooltip
            )}
          </span>
        )}
        {isLoadingValue && (
          <span className='loader-wrapper'>
            <InputLoader />
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
