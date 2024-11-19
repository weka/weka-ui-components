import React from 'react'
import clsx from 'clsx'
import { EMPTY_STRING } from '~consts'

import './textField.scss'

interface TextFieldProps {
  onChange: (newVal: any) => void
  value: string | number
  wrapperClass?: string
  error?: any
  label: string
  secondLabel?: string
}
function TextField(props: TextFieldProps) {
  const { label, onChange, value, error, wrapperClass, secondLabel, ...rest } =
    props

  function onTextChange(event) {
    onChange(
      !Number.isNaN(event.target.valueAsNumber)
        ? event.target.valueAsNumber
        : event.target.value
    )
  }

  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'text-field': true,
    'has-error': !!error
  })

  return (
    <div className={wrapperClasses}>
      <span className='text-field-first-label label-5'>{label}</span>
      <div className='field-input-wrapper'>
        <input
          className='field__input'
          value={value || EMPTY_STRING}
          onChange={onTextChange}
          {...rest}
        />
        <span className='text-field-error capitalize-first-letter'>
          {error}
        </span>
      </div>
      <span className='text-field-second-label label-5'>{secondLabel}</span>
    </div>
  )
}

export default TextField
