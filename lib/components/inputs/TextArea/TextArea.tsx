import React, { ReactElement } from 'react'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING } from 'consts'
import svgs from 'svgs'

import './textArea.scss'

const { Info } = svgs

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
  insetLabel?: boolean
}
const TextArea = (props: TextAreaProps) => {
  const {
    label,
    onChange,
    value,
    error,
    placeholder,
    wrapperClass = EMPTY_STRING,
    isRequired,
    info,
    tooltip = EMPTY_STRING,
    disabled = false,
    insetLabel = false,
    ...rest
  } = props

  function onTextChange(event) {
    onChange(event.target.value)
  }

  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'text-area-field': true,
    'has-error': !!error,
    'text-area-field-inset-label': insetLabel
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
