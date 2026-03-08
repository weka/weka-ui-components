import React, { useState } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'
import Utils from 'utils'

import Info from '../../Info'
import Select from '../Select'
import TextBox from '../TextBox'

import './textSelectBox.scss'

interface TextSelectBoxProps {
  label: string
  onChange: (newVal: any) => void
  isRequired?: boolean
  selectPlaceholder?: any
  value?: any
  wrapperClass?: string
  error?: string
  info?: string
  options: any[]
  formatFunc: (val: any) => any
}
function TextSelectBox({
  label,
  onChange,
  value,
  wrapperClass = EMPTY_STRING,
  options,
  formatFunc,
  info,
  selectPlaceholder,
  error,
  isRequired,
  ...rest
}: TextSelectBoxProps) {
  const { number, unit } = formatFunc(value)
  const [textValue, setTextValue] = useState(number)
  const [selectValue, setSelectValue] = useState(
    unit.value || selectPlaceholder
  )
  const classes = clsx({
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
        {isRequired ? <span className='required-star'>*</span> : null}
        {info ? <Info data={info} /> : null}
      </span>
      <TextBox
        onChange={onTextChange}
        type='number'
        value={textValue}
        {...rest}
      />
      <div className='spread-line' />
      <Select
        onChange={onSelectChange}
        options={options}
        value={selectValue}
      />
      <span className='text-select-error capitalize-first-letter'>{error}</span>
    </div>
  )
}

export default TextSelectBox
