import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  ChangeEvent
} from 'react'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING, EVENT_KEYS } from '~consts'
import Utils from '~utils'
import { Info } from '~svgs'

import './ipRangeTextBox.scss'

type Subnet = {
  ip: string
  mask: string
}
function keyDown(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key === EVENT_KEYS.DOT || event.key === EVENT_KEYS.ARROW_RIGHT) {
    Utils.goToNextInput()
    event.preventDefault()
  } else if (event.key === EVENT_KEYS.ARROW_LEFT) {
    Utils.goToPreviousInput()
    event.preventDefault()
  }
}

function getFormatMask(subnet: Subnet) {
  const mask = []
  if (subnet) {
    const splitIp = subnet.ip?.split('.')
    const splitMask = subnet.mask?.split('.')
    for (let i = 0; i < 4; i++) {
      if (splitMask[i] === '255') {
        mask.push(splitIp[i])
      }
    }
  }
  return mask
}

interface IpRangeTextBoxProps {
  disabled?: boolean
  isRequired?: boolean
  onChange: (newVal: any) => void
  value: any
  subnet: Subnet
  wrapperClass?: string
  label: string
  error: string
  info?: string
}

function IpRangeTextBox(props: IpRangeTextBoxProps) {
  const {
    label,
    onChange,
    value,
    error,
    wrapperClass = '',
    subnet,
    disabled,
    isRequired,
    info,
    ...rest
  } = props
  const ref = useRef<HTMLHeadingElement>(null)
  const mask = getFormatMask(subnet)
  const [ipVal, range] = value
    ? value.split('-')
    : [[...mask, '', '', '', ''].slice(0, 4).join('.'), '']
  const [ipParts, setIpParts] = useState([...ipVal.split('.'), range])
  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'ip-range-text-box-field': true,
    'ip-range-text-box-disabled': disabled,
    'has-error': !!error
  })

  useEffect(() => {
    // for start the default value with subnet
    if (subnet) {
      if (ipParts.slice(0, 4).some(Utils.isEmpty)) {
        onChange(EMPTY_STRING)
      } else {
        onChange(
          `${ipParts.slice(0, 4).join('.')}${
            ipParts[4] !== EMPTY_STRING ? `-${ipParts[4]}` : EMPTY_STRING
          }`
        )
      }
    }
  }, [])

  function setIpPart(index: number, val: ChangeEvent<HTMLInputElement>) {
    const newIpParts = [...ipParts]
    newIpParts[index] =
      val.target.value &&
      Math.max(0, Math.min(255, parseInt(val.target.value, 10)))
    if (newIpParts[index] >= 100) {
      Utils.goToNextInput()
    }
    setIpParts(newIpParts)
    if (newIpParts.slice(0, 4).some(Utils.isEmpty)) {
      onChange(EMPTY_STRING)
    } else {
      onChange(
        `${newIpParts.slice(0, 4).join('.')}${
          newIpParts[4] !== EMPTY_STRING ? `-${newIpParts[4]}` : EMPTY_STRING
        }`
      )
    }
  }

  useLayoutEffect(() => {
    if (ref.current) {
      const inputs = Array.from(ref.current.getElementsByTagName('input'))
      const firstEmptyInput =
        inputs.find((input) => input.value === EMPTY_STRING) || inputs[0]
      firstEmptyInput.focus()
    }
  }, [])

  return (
    <div className={wrapperClasses}>
      <div className='value-container' ref={ref}>
        {Utils.range(5).map((inputIndex) => (
          <div className='ip-part-value-edit' key={`input_${inputIndex}`}>
            <input
              value={ipParts[inputIndex]}
              disabled={mask.length >= inputIndex + 1}
              onKeyDown={keyDown}
              type='number'
              onChange={(newValue) => setIpPart(inputIndex, newValue)}
              {...rest}
            />
            {['.', '.', '.', '-', EMPTY_STRING][inputIndex]}
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
      <span className='ip-range-text-box-error capitalize-first-letter'>
        {error}
      </span>
    </div>
  )
}
export default IpRangeTextBox
