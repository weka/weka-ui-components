import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING, NOP } from '../../../consts'
import Utils from '../../../utils'
import { Info } from '../../../svgs'

import './ipSubnetTextBox.scss'

function keyDown(event: React.KeyboardEvent) {
  if (
    event.key === 'e' ||
    event.key === 'E' ||
    event.key === '-' ||
    event.key === '+'
  ) {
    event.preventDefault()
  }
  if (event.key === '.' || event.key === 'ArrowRight') {
    Utils.goToNextInput()
    event.preventDefault()
  } else if (event.key === 'ArrowLeft') {
    Utils.goToPreviousInput()
    event.preventDefault()
  }
}

interface IpSubnetTextBoxProps {
  disabled?: boolean
  isRequired?: boolean
  onChange: (newVal: any) => void
  value: string
  wrapperClass?: string
  label: string
  error?: string
  info?: string
}

function IpSubnetTextBox(props: IpSubnetTextBoxProps) {
  const {
    label,
    onChange = NOP,
    value,
    error,
    wrapperClass = '',
    isRequired,
    info,
    ...rest
  } = props
  const { disabled } = rest
  const [ipVal, subnet] = value ? value.split('/') : ['...', '']
  const [ipParts, setIpParts] = useState<any[]>([
    ...ipVal.split('.'),
    Utils.subnet2MaskOp(subnet)
  ])
  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'ip-subnet-text-box-field': true,
    disabled,
    'has-error': !!error
  })

  function setIpPart(index: number, val: ChangeEvent<HTMLInputElement>) {
    const newIpParts = [...ipParts]
    if (index === 4) {
      newIpParts[index] =
        val.target.value &&
        Math.max(0, Math.min(32, parseInt(val.target.value, 10)))
    } else {
      newIpParts[index] =
        val.target.value &&
        Math.max(0, Math.min(255, parseInt(val.target.value, 10)))
      if (newIpParts[index] >= 100) {
        Utils.goToNextInput()
      }
    }
    setIpParts(newIpParts)
    if (newIpParts.some(Utils.isEmpty)) {
      onChange(EMPTY_STRING)
    } else {
      onChange(
        `${newIpParts.slice(0, 4).join('.')}/${Utils.mask2SubnetOp(
          newIpParts.slice(4)
        )}`
      )
    }
  }

  const inputsRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const focusElement = document.activeElement as HTMLElement
    if (
      focusElement.parentNode &&
      focusElement.parentNode.parentNode === inputsRef.current
    ) {
      inputsRef.current?.firstElementChild.firstElementChild.focus()
    }
  }, [inputsRef.current])
  return (
    <div className={wrapperClasses}>
      <div ref={inputsRef} className='value-container'>
        {Utils.range(5).map((inputIndex) => (
          <div className='ip-part-value-edit' key={`input_${inputIndex}`}>
            <input
              value={ipParts[inputIndex]}
              onKeyDown={keyDown}
              type='number'
              onChange={(newValue) => setIpPart(inputIndex, newValue)}
              {...rest}
            />
            {['.', '.', '.', '/'][inputIndex]}
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
      <span className='ip-subnet-error capitalize-first-letter'>{error}</span>
    </div>
  )
}
export default IpSubnetTextBox
