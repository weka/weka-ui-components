import React, { useState } from 'react'
import classNames from 'classnames'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING, NOP } from '../../../consts'
import Utils from '../../../utils'
import { Info } from '../../../svgs'

import './ipTextBox.scss'

function keyDown(event: React.KeyboardEvent) {
  if (event.key === '.' || event.key === 'ArrowRight') {
    Utils.goToNextInput()
    event.preventDefault()
  } else if (event.key === 'ArrowLeft') {
    Utils.goToPreviousInput()
    event.preventDefault()
  }
}

interface IpTextBoxProps {
  disabled?: boolean,
  isRequired?: boolean,
  onChange: (newVal: any) => void,
  value: string,
  wrapperClass?: string,
  label: string,
  error?: string,
  info?: string
}

function IpTextBox(props: IpTextBoxProps) {
  const { label, onChange = NOP, value, error, wrapperClass = '', isRequired, info, ...rest } = props
  const { disabled } = rest
  const [ipParts, setIpParts] = useState(value ? value.split('.') : ['', '', '', ''])
  const wrapperClasses = classNames({
    [wrapperClass]: true,
    'ip-text-box-field': true,
    'ip-text-box-disabled': disabled,
    'has-error': !!error
  })

  function setIpPart(index, val) {
    const newIpParts = [...ipParts]
    newIpParts[index] = val.target.value && Math.max(0, Math.min(255, parseInt(val.target.value, 10)))
    if (newIpParts[index] >= 100) {
      Utils.goToNextInput()
    }
    setIpParts(newIpParts)
    if (newIpParts.some(Utils.isEmpty)) {
      onChange(EMPTY_STRING)
    } else {
      onChange(newIpParts.join('.'))
    }
  }

  return (
    <div className={wrapperClasses}>
      <div className='value-container'>
        {Utils.range(4).map((inputIndex) => (
          <div className='ip-part-value-edit' key={`input_${inputIndex}`}>
            <input
              value={ipParts[inputIndex]}
              onKeyDown={keyDown}
              type='number'
              onChange={(newValue) => setIpPart(inputIndex, newValue)}
              {...rest}
            />
            {inputIndex !== 3 ? '.' : EMPTY_STRING}
          </div>
        ))}
      </div>
      <span className='field__label-wrap'>
        <span className='field__label field-1-label-content'>
          {label}
          {isRequired && <span className='required-star'>*</span>}
          {!!info && <Tooltip data={info}><Info /></Tooltip>}
        </span>
      </span>
      <span className='ip-text-box-error capitalize-first-letter'>{error}</span>
    </div>
  )
}
export default IpTextBox
