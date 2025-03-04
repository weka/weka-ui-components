import React, { useState } from 'react'
import clsx from 'clsx'
import TextBox from '../TextBox'
import Select from '../Select'
import Utils from 'utils'
import { EMPTY_STRING } from 'consts'
import Info from '../../Info'

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
function TextSelectBox(props: TextSelectBoxProps) {
  const {
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
  } = props
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
        {isRequired && <span className='required-star'>*</span>}
        {info && <Info data={info} />}
      </span>
      <TextBox
        value={textValue}
        type='number'
        onChange={onTextChange}
        {...rest}
      />
      <div className='spread-line' />
      <Select value={selectValue} options={options} onChange={onSelectChange} />
      <span className='text-select-error capitalize-first-letter'>{error}</span>
    </div>
  )
}

export default TextSelectBox
