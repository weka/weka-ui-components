import React from 'react'
import { IconButton } from '@mui/material'
import copy from 'copy-to-clipboard'
import { Copy } from 'svgs'

import './toast.scss'

interface ToastProps {
  message: string
  icon: React.ReactNode
}

function Toast(props: ToastProps) {
  const { message, icon } = props
  return (
    <div className='toast-wrapper'>
      <span>{icon}</span>
      <span className='label-1'>{message}</span>
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

Toast.propTypes = {}

export default Toast
