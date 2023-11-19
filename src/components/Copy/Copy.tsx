import React, { FC, useState } from 'react'
import { IconButton } from '@mui/material'
import Tooltip from '../Tooltip'
import copy from 'copy-to-clipboard'
import clsx from 'clsx'

import { Copy as CopyIcon, CheckMark } from '../../svgs'

import './copy.scss'

interface CopyProps {
  text: string
  extraClass?: string
  CopyComponent?: FC<{ onClick: (e: React.MouseEvent) => void }>
  copyText?: string
}

function Copy(props: CopyProps) {
  const { text, extraClass, CopyComponent, copyText = 'Copy' } = props

  const [isCopyPress, setCopyPress] = useState(false)

  function onClick(e: React.MouseEvent) {
    e.stopPropagation()

    copy(text)
    setCopyPress(true)
    setTimeout(() => setCopyPress(false), 2000)
  }

  return (
    <Tooltip data={isCopyPress ? 'Copied!' : copyText}>
      <div className={clsx('copy-wrapper', extraClass)}>
        {!isCopyPress ? (
          CopyComponent ? (
            <CopyComponent onClick={onClick} />
          ) : (
            <IconButton className='copy' onClick={onClick}>
              <CopyIcon />
            </IconButton>
          )
        ) : (
          <CheckMark className='copied' />
        )}
      </div>
    </Tooltip>
  )
}

export default Copy
