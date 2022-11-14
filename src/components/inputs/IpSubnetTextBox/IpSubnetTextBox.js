import React, { useEffect, useRef, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING, NOP } from '../../../consts'
import Utils from '../../../utils'
import { Info } from '../../../svgs'

import './ipSubnetTextBox.scss'

function keyDown(event) {
  if (event.key === '.' || event.key === 'ArrowRight') {
    Utils.goToNextInput()
    event.preventDefault()
  } else if (event.key === 'ArrowLeft') {
    Utils.goToPreviousInput()
    event.preventDefault()
  }
}

function IpSubnetTextBox(props) {
  const { label, onChange, value, error, wrapperClass, isRequired, info, ...rest } = props
  const { disabled } = rest
  const [ipVal, subnet] = value ? value.split('/') : ['...', '']
  const [ipParts, setIpParts] = useState([...ipVal.split('.'), Utils.subnet2MaskOp(subnet)])
  const wrapperClasses = classNames({
    [wrapperClass]: true,
    'ip-subnet-text-box-field': true,
    disabled,
    'has-error': !!error
  })

  function setIpPart(index, val) {
    const newIpParts = [...ipParts]
    if (index === 4) {
      newIpParts[index] = val.target.value && Math.max(0, Math.min(32, parseInt(val.target.value, 10)))
    } else {
      newIpParts[index] = val.target.value && Math.max(0, Math.min(255, parseInt(val.target.value, 10)))
      if (newIpParts[index] >= 100) {
        Utils.goToNextInput()
      }
    }
    setIpParts(newIpParts)
    if (newIpParts.some(Utils.isEmpty)) {
      onChange(EMPTY_STRING)
    } else {
      onChange(`${newIpParts.slice(0, 4).join('.')}/${Utils.mask2SubnetOp(newIpParts.slice(4))}`)
    }
  }

  const inputsRef = useRef(null)
  useEffect(() => {
    const focusElement = document.activeElement
    if (focusElement.parentNode.parentNode === inputsRef.current) {
      inputsRef.current.firstElementChild.firstElementChild.select()
      inputsRef.current.firstElementChild.firstElementChild.focus()
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
          {!!info && <Tooltip data={info}><Info /></Tooltip>}
        </span>
      </span>
      <span className='ip-subnet-error capitalize-first-letter'>{error}</span>
    </div>
  )
}

IpSubnetTextBox.defaultProps = {
  onChange: NOP,
  disabled: false,
  value: EMPTY_STRING,
  error: EMPTY_STRING,
  isRequired: false,
  wrapperClass: EMPTY_STRING,
  label: EMPTY_STRING,
  info: EMPTY_STRING
}

IpSubnetTextBox.propTypes = {
  disabled: propTypes.bool,
  isRequired: propTypes.bool,
  onChange: propTypes.func,
  value: propTypes.any,
  wrapperClass: propTypes.string,
  label: propTypes.oneOfType([propTypes.string, propTypes.object]),
  error: propTypes.any,
  info: propTypes.any
}

export default IpSubnetTextBox
