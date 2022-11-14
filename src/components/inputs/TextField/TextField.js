import React from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { EMPTY_STRING } from '../../../consts'

import './textField.scss'

function TextField(props) {
  const { label, onChange, value, error, wrapperClass, secondLabel, ...rest } = props

  function onTextChange(event) {
    onChange(!Number.isNaN(event.target.valueAsNumber) ? event.target.valueAsNumber : event.target.value)
  }

  const wrapperClasses = classNames({
    [wrapperClass]: true,
    'text-field': true,
    'has-error': !!error
  })

  return (
    <div className={wrapperClasses}>
      <span className='text-field-first-label label-5'>{label}</span>
      <div className='field-input-wrapper'>
        <input className='field__input' value={value || EMPTY_STRING} onChange={onTextChange} {...rest} />
        <span className='text-field-error capitalize-first-letter'>{error}</span>
      </div>
      <span className='text-field-second-label label-5'>{secondLabel}</span>
    </div>
  )
}

TextField.defaultProps = {
  onChange: () => {
  },
  value: EMPTY_STRING,
  wrapperClass: EMPTY_STRING,
  secondLabel: EMPTY_STRING,
  error: false
}

TextField.propTypes = {
  onChange: propTypes.func,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  wrapperClass: propTypes.string,
  error: propTypes.any,
  label: propTypes.string.isRequired,
  secondLabel: propTypes.string
}

export default TextField
