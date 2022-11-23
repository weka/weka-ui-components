import React from 'react'
import Tooltip from './components/Tooltip'
import { Hide, Show } from './svgs'
import { EMPTY_STRING } from './consts.js'

const utils = {
  isEllipsisActive(element) {
    return (element.offsetWidth < element.scrollWidth)
  },
  getPasswordIcon(showPassword, toggleShowPassword) {
    if (showPassword) {
      return (
        <Tooltip data='Hide password' placement='right'>
          <Show onClick={toggleShowPassword} />
        </Tooltip>
      )
    }
    return (
      <Tooltip data='Show password' placement='right'>
        <Hide onClick={toggleShowPassword} />
      </Tooltip>
    )
  },
  goToNextInput() {
    const nextInput = document.activeElement?.parentElement?.nextElementSibling?.firstElementChild
    if (nextInput) {
      nextInput.focus()
      nextInput.select()
    }
  },
  goToPreviousInput() {
    const previousInput = document.activeElement?.parentElement?.previousElementSibling?.firstElementChild
    if (previousInput) {
      previousInput.focus()
      previousInput.select()
    }
  },
  subnet2MaskOp: (subnet) => (
    subnet
      ? subnet
        .split('.')
        .reduce((globalBitMaskCounter, byte) => (
          [...Array(8).reverse().keys()]
            .reduce((bitMaskCounter, shiftingIndex) => (bitMaskCounter + ((byte >> shiftingIndex) & 1)),
              globalBitMaskCounter)), 0)
      : EMPTY_STRING),
  formatOption: (label, value) => (value !== undefined ? { label, value } : { label, value: label }),
  isEmpty: (val) => (
    val === null // null
    || val === undefined // undefined
    || val === EMPTY_STRING // empty string
    || (Array.isArray(val) && !val.length) // empty array
    || (Object.prototype.toString.call(val) === '[object Number]' && isNaN(val)) /* eslint-disable-line */ // NaN
    || (typeof val === 'object'
      && !Object.keys(val).length // empty object
      && Object.prototype.toString.call(val) !== '[object Date]') // Date
  ),
  isString: (value) => (typeof value === 'string' || value instanceof String),
  isObject: (value) => (typeof value === 'object' && (value !== null && !Array.isArray(value))),
  insensitiveSort(array, key) {
    const newArray = [...array]
    return newArray.sort((objA, objB) => {
      if (key) {
        return objA[key].toLowerCase().localeCompare(objB[key].toLowerCase())
      }
      return objA.toLowerCase().localeCompare(objB.toLowerCase())
    })
  },
  range: (startOrEnd, end, step = 1) => {
    let newStartOrEnd = startOrEnd
    if (!end) {
      end = newStartOrEnd
      newStartOrEnd = 0
    }
    const result = []
    for (let i = newStartOrEnd; i < end; i += step) {
      result.push(i)
    }
    return result
  },
  mask2SubnetOp: (val) => [255, 255, 255, 255]
    .map(() => [...Array(8).keys()]
      .reduce((rst) => (rst * 2 + (val-- > 0)), 0))
    .join('.'),
  formatStringOption: (option) => ({ label: option, value: option }),

}

export default utils
