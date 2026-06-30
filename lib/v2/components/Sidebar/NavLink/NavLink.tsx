import type { SidebarItem } from '../types'

import clsx from 'clsx'

import { ChevronDownSmallIcon } from '../../../icons'

import styles from './navLink.module.scss'

interface NavLinkProps {
  item: SidebarItem
  hasSub: boolean
  active: boolean
  isOpen: boolean
  isHybrid: boolean
  isSidebarExpanded: boolean
  onClick: () => void
  onToggle: () => void
}

export function NavLink({
  item,
  hasSub,
  active,
  isOpen,
  isHybrid,
  isSidebarExpanded,
  onClick,
  onToggle
}: Readonly<NavLinkProps>) {
  const isActive = active && (!hasSub || !isSidebarExpanded || !isOpen)
  const rootClass = clsx(
    styles.navLink,
    isSidebarExpanded && styles.expanded,
    isActive && styles.active
  )
  const chevronClass = clsx(styles.navChevron, isOpen && styles.navChevronOpen)
  const chevron = <ChevronDownSmallIcon />

  if (isHybrid) {
    return (
      <div className={rootClass}>
        <button
          className={styles.navMain}
          onClick={onClick}
          type='button'
        >
          {item.icon}
          <span className={styles.navLinkText}>{item.label}</span>
        </button>
        <button
          aria-expanded={isOpen}
          aria-label='Toggle submenu'
          className={clsx(styles.navChevronBtn, chevronClass)}
          type='button'
          onClick={(event) => {
            event.stopPropagation()
            onToggle()
          }}
        >
          {chevron}
        </button>
      </div>
    )
  }

  return (
    <button
      aria-expanded={hasSub ? isOpen : undefined}
      className={rootClass}
      onClick={onClick}
      type='button'
    >
      {item.icon}
      <span className={styles.navLinkText}>{item.label}</span>
      {hasSub ? <span className={chevronClass}>{chevron}</span> : null}
    </button>
  )
}
