import React, { useState } from 'react'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING, EVENT_KEYS, NOP } from '../../../consts'
import Utils from '../../../utils'
import { Info } from '../../../svgs'
import Copy from '../../Copy'

import './ipTextBox.scss'

function keyDown(event: React.KeyboardEvent) {
  if (event.key === EVENT_KEYS.DOT || event.key === EVENT_KEYS.ARROW_RIGHT) {
    Utils.goToNextInput()
    event.preventDefault()
  } else if (event.key === EVENT_KEYS.ARROW_LEFT) {
    Utils.goToPreviousInput()
    event.preventDefault()
  }
}

interface IpTextBoxProps {
  disabled?: boolean
  isRequired?: boolean
  onChange: (newVal: any) => void
  value: string
  wrapperClass?: string
  label: string
  error?: string
  info?: string
  allowCopy?: boolean
}

function IpTextBox(props: IpTextBoxProps) {
  const {
    label,
    onChange = NOP,
    value,
    error,
    wrapperClass = '',
    isRequired,
    info,
    allowCopy,
    ...rest
  } = props
  const { disabled } = rest
  const [ipParts, setIpParts] = useState(
    value ? value.split('.') : ['', '', '', '']
  )
  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'ip-text-box-field': true,
    'ip-text-box-disabled': disabled,
    'has-error': !!error
  })

  function setIpPart(index, val) {
    const newIpParts = [...ipParts]
    newIpParts[index] =
      val.target.value &&
      Math.max(0, Math.min(255, parseInt(val.target.value, 10)))
    if (newIpParts[index] >= 100) {
      Utils.goToNextInput()
    }
    setIpParts(newIpParts)
    if (isRequired && newIpParts.some(Utils.isEmpty)) {
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
              onPaste={(e) => {
                e.preventDefault()
                const pastedData = e.clipboardData.getData('text')
                if (Utils.isIp(pastedData)) {
                  const ipArr = pastedData.split('.')
                  setIpParts(ipArr)
                  onChange(ipArr.join('.'))
                }
              }}
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
          {!!info && (
            <Tooltip data={info}>
              <Info />
            </Tooltip>
          )}
        </span>
      </span>
      {allowCopy && value && Utils.isIp(value) && <Copy text={value} />}
      <span className='ip-text-box-error capitalize-first-letter'>{error}</span>
    </div>
  )
}
export default IpTextBox
