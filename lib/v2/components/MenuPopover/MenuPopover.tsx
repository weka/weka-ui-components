import { type ReactNode, type RefObject, useRef } from 'react'
import clsx from 'clsx'

import { useClickOutside, usePopoverPosition } from '#v2/hooks'

import styles from './menuPopover.module.scss'

export const MENU_POPOVER_STYLES = {
  menuItem: styles.menuItem,
  menuHeader: styles.menuHeader,
  menuItemIndent: styles.menuItemIndent
} as const

export interface MenuPopoverProps {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLElement>
  children: ReactNode
  /** Extra class applied to the popover container (e.g. to widen it). */
  extraClass?: string
}

export function MenuPopover({
  open,
  onClose,
  anchorRef,
  children,
  extraClass
}: Readonly<MenuPopoverProps>) {
  const popRef = useRef<HTMLDivElement>(null)

  useClickOutside(popRef as unknown as RefObject<HTMLElement>, onClose, {
    additionalRefs: [anchorRef],
    enabled: open
  })

  const { position } = usePopoverPosition(open, anchorRef, onClose, {
    contentRef: popRef as unknown as RefObject<HTMLElement>
  })

  if (!open) {
    return null
  }

  return (
    <div
      ref={popRef}
      className={clsx(styles.popover, extraClass)}
      style={position}
    >
      {children}
    </div>
  )
}
