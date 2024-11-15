import React, { ReactNode, useState } from 'react'
import { IconButton } from '@mui/material'
import Tooltip from '../Tooltip'
import copy from 'copy-to-clipboard'
import clsx from 'clsx'

import { Copy as CopyIcon, CheckMark } from 'svgs'

import './copy.scss'

interface CopyProps {
  text: string
  extraClass?: string
  copyIcon?: ReactNode
  copyText?: string
}

function Copy(props: CopyProps) {
  const { text, extraClass, copyIcon: outerCopyIcon, copyText = 'Copy' } = props

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
          <IconButton className='copy' onClick={onClick}>
            {outerCopyIcon ?? <CopyIcon />}
          </IconButton>
        ) : (
          <CheckMark className='copied' />
        )}
      </div>
    </Tooltip>
  )
}

export default Copy
