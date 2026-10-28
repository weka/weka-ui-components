import React from 'react'
import { IconButton } from '@mui/material'
import copy from 'copy-to-clipboard'
import { COPY_TO_CLIPBOARD_OPTIONS } from '#consts'
import svgs from '#svgs'

import './toast.scss'

const { Copy } = svgs

interface ToastProps {
  message: string
  icon: React.ReactNode
}

function Toast({ message, icon }: ToastProps) {
  return (
    <div className='toast-wrapper'>
      <span>{icon}</span>
      <span className='label-1'>{message}</span>
      <div className='copy-btn-div'>
        <IconButton
          className='toast-copy'
          onClick={(e) => {
            e.stopPropagation()
            void copy(message, COPY_TO_CLIPBOARD_OPTIONS)
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
