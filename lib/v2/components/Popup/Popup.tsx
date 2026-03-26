import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import { DOM_EVENTS, KEYBOARD_KEYS } from '../../utils/consts'

import styles from './popup.module.scss'

export const CONTENT_OVERFLOWS = {
  AUTO: 'auto',
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  SCROLL: 'scroll'
} as const

export type ContentOverflow =
  (typeof CONTENT_OVERFLOWS)[keyof typeof CONTENT_OVERFLOWS]

export interface PopupProps {
  open: boolean
  title: string
  onClose: () => void
  actions?: ReactNode
  children: ReactNode
  contentOverflow?: ContentOverflow
  extraClass?: string
  closeOnOverlayClick?: boolean
  dataTestId?: string
}

export function Popup({
  open,
  title,
  onClose,
  actions,
  children,
  contentOverflow = CONTENT_OVERFLOWS.AUTO,
  extraClass,
  closeOnOverlayClick = true,
  dataTestId
}: Readonly<PopupProps>) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_KEYS.ESCAPE) {
        onClose()
      }
    }

    document.addEventListener(DOM_EVENTS.KEYDOWN, handleKeyDown)

    return () => {
      document.removeEventListener(DOM_EVENTS.KEYDOWN, handleKeyDown)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return createPortal(
    <div
      className={styles.overlay}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className={clsx(styles.modal, extraClass)}
        data-testid={dataTestId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button
            aria-label='Close'
            className={styles.closeBtn}
            data-testid={dataTestId ? `${dataTestId}-close` : undefined}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div
          className={styles.content}
          style={{ overflow: contentOverflow }}
        >
          {children}
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </div>,
    document.body
  )
}
