import React from 'react'
import { IconButton } from '@mui/material'

import svgs from '#svgs'
import { copyToClipboard } from '#v2/utils/clipboard'

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
            void copyToClipboard(message)
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
