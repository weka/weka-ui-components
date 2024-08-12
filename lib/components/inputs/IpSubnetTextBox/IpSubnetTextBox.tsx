import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING, EVENT_KEYS, NOP } from '../../../consts'
import Utils from '../../../utils'
import { Info } from '../../../svgs'
import Copy from '../../Copy'

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
  if (event.key === '0' && event.target.value?.startsWith('0')) {
    event.preventDefault()
  }
  if (event.key === EVENT_KEYS.DOT || event.key === EVENT_KEYS.ARROW_RIGHT) {
    Utils.goToNextInput()
    event.preventDefault()
  } else if (event.key === EVENT_KEYS.ARROW_LEFT) {
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
  shouldConvertSubnet2Mask?: boolean
  fixedSubnet?: number
  allowCopy?: boolean
}

function IpSubnetTextBox(props: IpSubnetTextBoxProps) {
  const {
    label,
    onChange = NOP,
    value,
    error,
    wrapperClass = EMPTY_STRING,
    isRequired,
    info,
    shouldConvertSubnet2Mask = true,
    fixedSubnet,
    allowCopy,
    ...rest
  } = props
  const { disabled } = rest
  const [ipVal, subnet] = value ? value.split('/') : ['...', fixedSubnet ?? EMPTY_STRING]
  const [ipParts, setIpParts] = useState<any[]>(
    shouldConvertSubnet2Mask
      ? [...ipVal.split('.'), Utils.subnet2MaskOp(subnet)]
      : [...ipVal.split('.'), subnet]
  )
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
      if (isRequired) {
        onChange(EMPTY_STRING)
      } else {
        onChange(`${newIpParts.slice(0, 4).join('.')}/${newIpParts.slice(4)}`)
      }
    } else {
      if (shouldConvertSubnet2Mask) {
        onChange(
          `${newIpParts.slice(0, 4).join('.')}/${Utils.mask2SubnetOp(
            newIpParts.slice(4)
          )}`
        )
      } else {
        onChange(`${newIpParts.slice(0, 4).join('.')}/${newIpParts.slice(4)}`)
      }
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
              onPaste={(e) => {
                e.preventDefault()
                const pastedData = e.clipboardData.getData('text')
                if (Utils.isIpSubnet(pastedData)) {
                  const [ip, subnet] = pastedData.split('/')
                  const ipArr = ip.split('.')
                  setIpParts([...ipArr, fixedSubnet ?? subnet])
                  onChange(`${ipArr.join('.')}/${fixedSubnet ?? subnet}`)
                }
              }}
              type='number'
              readOnly={!!fixedSubnet && inputIndex === 4}
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
      {allowCopy && value && <Copy text={value} />}
      <span className='ip-subnet-error capitalize-first-letter'>{error}</span>
    </div>
  )
}
export default IpSubnetTextBox
