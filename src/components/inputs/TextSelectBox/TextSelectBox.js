import React, { useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import TextBox from '../TextBox'
import Select from '../Select'
import { EMPTY_STRING } from '../../../consts'
import Utils from '../../../utils'
import Info from '../../Info'

import './textSelectBox.scss'

function TextSelectBox(props) {
  const { label, onChange, value, wrapperClass, options, formatFunc, info, selectPlaceholder, error, isRequired, ...rest } = props
  const { number, unit } = formatFunc(value)
  const [textValue, setTextValue] = useState(number)
  const [selectValue, setSelectValue] = useState(unit.value || selectPlaceholder)
  const classes = classNames({
    [wrapperClass]: true,
    'has-error': !!error,
    'text-select-wrapper': true
  })

  const onTextChange = (newValue) => {
    if (Utils.isEmpty(newValue)) {
      onChange(undefined)
    } else if (!Utils.isEmpty(selectValue)) {
      onChange(Math.floor(selectValue * newValue))
    }
    setTextValue(newValue)
  }
  const onSelectChange = (newValue) => {
    if (Utils.isEmpty(newValue)) {
      onChange(undefined)
    } else if (!Utils.isEmpty(textValue)) {
      onChange(Math.floor(textValue * newValue))
    } else {
      onChange(undefined)
    }
    setSelectValue(newValue)
  }

  return (
    <div className={classes}>
      <span className='text-select-label field-1-label-content'>
        {label}
        {isRequired && <span className='required-star'>*</span>}
        {info && <Info data={info} />}
      </span>
      <TextBox value={textValue} type='number' onChange={onTextChange} {...rest} />
      <div className='spread-line' />
      <Select value={selectValue} options={options} onChange={onSelectChange} />
      <span className='text-select-error capitalize-first-letter'>{error}</span>
    </div>
  )
}

TextSelectBox.defaultProps = {
  wrapperClass: EMPTY_STRING,
  info: EMPTY_STRING,
  value: undefined,
  selectPlaceholder: undefined,
  error: EMPTY_STRING,
  isRequired: false
}

TextSelectBox.propTypes = {
  label: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  isRequired: propTypes.bool,
  selectPlaceholder: propTypes.any,
  value: propTypes.any,
  wrapperClass: propTypes.string,
  error: propTypes.string,
  info: propTypes.string,
  options: propTypes.array.isRequired,
  formatFunc: propTypes.func.isRequired
}

export default TextSelectBox
