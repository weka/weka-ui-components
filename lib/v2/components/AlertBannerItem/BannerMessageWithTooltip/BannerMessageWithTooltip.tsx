import type { ReactNode } from 'react'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from '../alertBannerItem.module.scss'

const TOOLTIP_OPEN_DELAY_MS = 400
const TOOLTIP_VIEWPORT_MARGIN = 8

export interface BannerMessageWithTooltipProps {
  fullText: string
  children: ReactNode
}

/**
 * Tiny custom hover-tooltip for the banner message. We render the popup
 * ourselves (via portal to document.body) instead of relying on the shared
 * Tooltip because MuiTooltip's clone-injected hover handlers don't fire
 * reliably when the banner sits inside a wizard popup — `pointerenter` arrives
 * natively on the wrapper but React/MUI never opens the popper. This uses
 * native onMouseEnter/onMouseLeave with the same delay, positions a styled box
 * just below the anchor, and matches the shared Tooltip theme tokens so it
 * reads as the same component visually. Theme-aware via mode-flipping vars.
 */
export function BannerMessageWithTooltip({
  fullText,
  children
}: Readonly<BannerMessageWithTooltipProps>) {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [position, setPosition] = useState<{
    top: number
    left: number
  } | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    },
    []
  )

  const isTruncated = () => {
    const anchor = anchorRef.current
    if (!anchor) {
      return false
    }
    return anchor.scrollWidth > anchor.clientWidth
  }

  const handleEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (!isTruncated()) {
      return
    }
    timerRef.current = setTimeout(() => {
      const anchor = anchorRef.current
      if (!anchor) {
        return
      }
      const rect = anchor.getBoundingClientRect()
      setPosition({
        top: rect.bottom + TOOLTIP_VIEWPORT_MARGIN / 2,
        left: rect.left
      })
    }, TOOLTIP_OPEN_DELAY_MS)
  }

  const handleLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setPosition(null)
  }

  return (
    <>
      <span
        ref={anchorRef}
        className={styles.message}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {children}
      </span>
      {position
        ? createPortal(
            <div
              className={styles.messageTooltip}
              role='tooltip'
              style={{ top: position.top, left: position.left }}
            >
              {fullText}
            </div>,
            document.body
          )
        : null}
    </>
  )
}
