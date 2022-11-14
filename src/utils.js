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
}

export default utils
