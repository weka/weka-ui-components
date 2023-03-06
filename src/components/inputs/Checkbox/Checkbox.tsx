import React, { InputHTMLAttributes } from 'react'

import './checkbox.scss'

function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className='checkbox-container'>
      <input className='checkbox-input' type='checkbox' {...props} />
      <span className='checkmark' />
    </span>
  )
}

export default Checkbox
