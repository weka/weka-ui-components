import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import Tooltip from '../Tooltip'
import copy from 'copy-to-clipboard'

import { Copy as CopyIcon, CheckMark } from '../../svgs'

import './copy.scss'

interface CopyProps {
  text: string
  extraClass?: string
}

function Copy({ text, extraClass }: CopyProps) {
  const [isCopyPress, setCopyPress] = useState(false)

  function onClick() {
    copy(text)
    setCopyPress(true)
    setTimeout(() => setCopyPress(false), 2000)
  }

  return (
    <Tooltip data={isCopyPress ? 'Copied!' : 'Copy'}>
      <span className={extraClass}>
        <IconButton
          className='copy'
          onClick={onClick}
          disabled={isCopyPress}
        >
          {!isCopyPress ? (
            <CopyIcon />
          ) : (
            <CheckMark className='green' />
          )}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default Copy
