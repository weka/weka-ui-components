import React, { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react'

import './checkbox.scss'

const Checkbox = forwardRef(function Checkbox(
  props: InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <span className='checkbox-container'>
      <input className='checkbox-input' type='checkbox' {...props} ref={ref} />
      <span className='checkmark' />
    </span>
  )
})

export default Checkbox
