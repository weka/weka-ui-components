import { type ReactNode, type RefObject, useRef } from 'react'
import { createPortal } from 'react-dom'
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
  /**
   * Renders a small context-menu-sized popover: content-width instead of the
   * default fixed width, tighter padding, and smaller menu items. Use for
   * short single-action menus (e.g. a drilldown confirmation).
   */
  compact?: boolean
}

export function MenuPopover({
  open,
  onClose,
  anchorRef,
  children,
  extraClass,
  compact = false
}: Readonly<MenuPopoverProps>) {
  const popRef = useRef<HTMLDivElement>(null)

  useClickOutside(popRef as unknown as RefObject<HTMLElement>, onClose, {
    additionalRefs: [anchorRef],
    enabled: open,
    capture: true
  })

  const { position } = usePopoverPosition(open, anchorRef, onClose, {
    contentRef: popRef as unknown as RefObject<HTMLElement>
  })

  if (!open) {
    return null
  }

  return createPortal(
    <div
      ref={popRef}
      style={position}
      className={clsx(
        styles.popover,
        { [styles.compact]: compact },
        extraClass
      )}
    >
      {children}
    </div>,
    document.body
  )
}
