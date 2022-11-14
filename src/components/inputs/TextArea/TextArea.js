import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING } from '../../../consts'
import { Info } from '../../../svgs'

import './textArea.scss'

const TextArea = (props) => {
  const { label, onChange, value, error, placeholder, wrapperClass, isRequired, info, ...rest } = props

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

TextArea.defaultProps = {
  onChange: () => {},
  value: undefined,
  info: EMPTY_STRING,
  isRequired: false,
  error: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  wrapperClass: EMPTY_STRING,
  label: EMPTY_STRING

}

TextArea.propTypes = {
  onChange: propTypes.func,
  value: propTypes.any,
  wrapperClass: propTypes.string,
  info: propTypes.string,
  isRequired: propTypes.bool,
  placeholder: propTypes.oneOfType([propTypes.string, propTypes.number]),
  label: propTypes.oneOfType([propTypes.string, propTypes.object]),
  error: propTypes.any
}

export default TextArea
