import React, {ReactElement} from 'react'
import classNames from 'classnames'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING } from '../../../consts'
import { Info } from '../../../svgs'

import './textArea.scss'

interface TextAreaProps {
  onChange?: (newVal: any) => void,
  value?: any,
  wrapperClass?: string,
  info?: string,
  isRequired?: boolean,
  placeholder?: string | number,
  label: string | ReactElement,
  error?: any
}
const TextArea = (props: TextAreaProps) => {
  const { label, onChange, value, error, placeholder, wrapperClass = '', isRequired, info, ...rest } = props

  function onTextChange(event) {
    onChange(event.target.value)
  }

  const wrapperClasses = classNames({
    [wrapperClass]: true,
    'text-area-field': true,
    'has-error': !!error
  })

  return (
    <div className={wrapperClasses}>
      <textarea
        className='field__input'
        placeholder={placeholder}
        value={value === null ? EMPTY_STRING : value}
        onChange={onTextChange}
        {...rest}
      />
      <span className='field__label-wrap'>
        <span className='field__label field-1-label-content'>
          {label}
          {isRequired && <span className='required-star'>*</span>}
          {!!info && <Tooltip data={info}><Info /></Tooltip>}
        </span>
      </span>
      <span className='text-area-error capitalize-first-letter'>{error}</span>
    </div>
  )
}
export default TextArea
