import { useEffect, useRef, useState } from 'react'

import { CheckIcon, CopyIcon } from '../../../icons'
import { IconButton } from '../../IconButton'
import { Tooltip } from '../../Tooltip'

import styles from '../jsonEditor.module.scss'

const COPIED_RESET_MS = 2000

interface JsonEditorCopyButtonProps {
  getText: () => string
}

export function JsonEditorCopyButton({
  getText
}: Readonly<JsonEditorCopyButtonProps>) {
  const [isCopied, setIsCopied] = useState(false)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(resetTimeoutRef.current), [])

  const handleCopy = () => {
    void navigator.clipboard.writeText(getText())
    setIsCopied(true)
    clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = setTimeout(
      () => setIsCopied(false),
      COPIED_RESET_MS
    )
  }

  return (
    <div className={styles.copyButton}>
      <Tooltip data={isCopied ? 'Copied!' : 'Copy'}>
        <IconButton
          ariaLabel={isCopied ? 'Copied' : 'Copy'}
          onClick={handleCopy}
          small
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </IconButton>
      </Tooltip>
    </div>
  )
}
