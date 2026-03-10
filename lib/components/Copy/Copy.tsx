import type { ReactNode } from 'react'
import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'

import svgs from 'svgs'

import Tooltip from '../Tooltip'

import './copy.scss'

const { Copy: CopyIcon, Checkmark } = svgs

interface CopyProps {
  text: string
  extraClass?: string
  copyIcon?: ReactNode
  copyText?: string
}

function Copy({
  text,
  extraClass,
  copyIcon: outerCopyIcon,
  copyText = 'Copy'
}: CopyProps) {
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
          <IconButton
            className='copy'
            onClick={onClick}
          >
            {outerCopyIcon ?? <CopyIcon />}
          </IconButton>
        ) : (
          <Checkmark className='copied' />
        )}
      </div>
    </Tooltip>
  )
}

export default Copy
