import React from 'react'
import propTypes from 'prop-types'
import { IconButton } from '@mui/material'
import copy from 'copy-to-clipboard'
import { Copy } from '../../svgs'

import './toast.scss'

function Toast(props) {
  const { message, icon } = props
  return (
    <div className='toast-wrapper'>
      <span>
        {icon}
      </span>
      <span className='label-1'>
        {message}
      </span>
      <div className='copy-btn-div'>
        <IconButton
          className='toast-copy'
          onClick={(e) => {
            e.stopPropagation()
            copy(message)
          }}
        >
          <Copy />
        </IconButton>
      </div>
    </div>
  )
}

Toast.propTypes = { message: propTypes.any.isRequired, icon: propTypes.any.isRequired }

export default Toast
