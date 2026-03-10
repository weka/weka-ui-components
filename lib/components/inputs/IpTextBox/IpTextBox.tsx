import React, { useState } from 'react'
import clsx from 'clsx'

import { EMPTY_STRING, EVENT_KEYS, NOP } from 'consts'
import svgs from 'svgs'
import Utils from 'utils'

import { useHighlightInput } from '../../../hooks'
import Copy from '../../Copy'
import Tooltip from '../../Tooltip'

import './ipTextBox.scss'

const { Info } = svgs

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
  isHighlighted?: boolean
  isScrolledInto?: boolean
}

function IpTextBox({
  label,
  onChange = NOP,
  value,
  error,
  wrapperClass = EMPTY_STRING,
  isRequired,
  info,
  allowCopy,
  isHighlighted,
  isScrolledInto,
  ...rest
}: IpTextBoxProps) {
  const { disabled } = rest
  const ipBoxRef = React.useRef<HTMLInputElement | null>(null)
  const [ipParts, setIpParts] = useState(
    value
      ? value.split('.')
      : [EMPTY_STRING, EMPTY_STRING, EMPTY_STRING, EMPTY_STRING]
  )
  const highlighted = useHighlightInput({
    inputRef: ipBoxRef,
    isHighlighted,
    isScrolledInto
  })
  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'ip-text-box-field': true,
    'ip-text-box-disabled': disabled,
    'has-error': !!error,
    'is-highlighted': highlighted
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
    <div
      ref={ipBoxRef}
      className={wrapperClasses}
    >
      <div className='value-container'>
        {Utils.range(4).map((inputIndex) => (
          <div
            key={`input_${inputIndex}`}
            className='ip-part-value-edit'
          >
            <input
              onChange={(newValue) => setIpPart(inputIndex, newValue)}
              onKeyDown={keyDown}
              type='number'
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
              {...rest}
            />
            {inputIndex !== 3 ? '.' : EMPTY_STRING}
          </div>
        ))}
      </div>
      <span className='field__label-wrap'>
        <span className='field__label field-1-label-content'>
          {label}
          {isRequired ? <span className='required-star'>*</span> : null}
          {!!info && (
            <Tooltip data={info}>
              <Info />
            </Tooltip>
          )}
        </span>
      </span>
      {allowCopy && value && Utils.isIp(value) ? <Copy text={value} /> : null}
      <span className='ip-text-box-error capitalize-first-letter'>{error}</span>
    </div>
  )
}
export default IpTextBox
