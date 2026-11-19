import type { MouseEvent, ReactNode } from 'react'

import { useEffect, useRef, useState } from 'react'
import { IconButton } from '@mui/material'
import clsx from 'clsx'

import svgs from '#svgs'
import { copyToClipboard } from '#v2/utils/clipboard'

import Tooltip from '../Tooltip'

import './copy.scss'

const { Copy: CopyIcon, Checkmark } = svgs

const COPIED_RESET_MS = 2000

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
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  useEffect(() => () => clearTimeout(resetTimeoutRef.current), [])

  async function copyToClipboardAndConfirm() {
    const isCopied = await copyToClipboard(text)
    if (!isCopied) {
      return
    }
    setCopyPress(true)
    clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = setTimeout(
      () => setCopyPress(false),
      COPIED_RESET_MS
    )
  }

  function onClick(e: MouseEvent) {
    e.stopPropagation()
    void copyToClipboardAndConfirm()
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
