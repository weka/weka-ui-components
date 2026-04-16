import { type ReactNode, type RefObject, useRef } from 'react'

import { useClickOutside, usePopoverPosition } from '../../hooks'

import styles from './menuPopover.module.scss'

export const MENU_POPOVER_STYLES = {
  menuItem: styles.menuItem
} as const

export interface MenuPopoverProps {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLElement>
  children: ReactNode
}

export function MenuPopover({
  open,
  onClose,
  anchorRef,
  children
}: Readonly<MenuPopoverProps>) {
  const popRef = useRef<HTMLDivElement>(null)

  useClickOutside(popRef as unknown as RefObject<HTMLElement>, onClose, {
    additionalRefs: [anchorRef],
    enabled: open
  })

  const { position } = usePopoverPosition(open, anchorRef, onClose)

  if (!open) {
    return null
  }

  return (
    <div
      ref={popRef}
      className={styles.popover}
      style={position}
    >
      {children}
    </div>
  )
}
