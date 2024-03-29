import React, { ReactElement } from 'react'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING } from '../../../consts'
import { Info } from '../../../svgs'

import './textArea.scss'

export interface TextAreaProps {
  onChange?: (newVal: any) => void
  value?: any
  wrapperClass?: string
  info?: string
  isRequired?: boolean
  placeholder?: string | number
  label: string | ReactElement
  error?: any
  tooltip?: string
  disabled?: boolean
}
const TextArea = (props: TextAreaProps) => {
  const {
    label,
    onChange,
    value,
    error,
    placeholder,
    wrapperClass = '',
    isRequired,
    info,
    tooltip = EMPTY_STRING,
    disabled = false,
    ...rest
  } = props

  function onTextChange(event) {
    onChange(event.target.value)
  }

  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'text-area-field': true,
    'has-error': !!error
  })

  return (
    <div className={wrapperClasses}>
      <Tooltip data={tooltip}>
        <textarea
          className='field__input'
          placeholder={placeholder}
          value={value === null ? EMPTY_STRING : value}
          onChange={onTextChange}
          disabled={disabled}
          {...rest}
        />
      </Tooltip>
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
      <span className='text-area-error capitalize-first-letter'>{error}</span>
    </div>
  )
}
export default TextArea
