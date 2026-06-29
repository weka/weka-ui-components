import type { SidebarItem } from '../types'

import { useState } from 'react'

import { TOOLTIP_PLACEMENTS } from '#v2/utils/consts'

import { Tooltip } from '../../Tooltip'
import { NavLink } from '../NavLink'
import { SidebarSubmenu } from '../SidebarSubmenu'
import { hasSubItems, isItemActive } from '../sidebarUtils'

import styles from './navItem.module.scss'

interface NavItemProps {
  item: SidebarItem
  isSidebarExpanded: boolean
  isOpen: boolean
  currentPath: string
  onNavigate: (href: string) => void
  onExpand: () => void
  onToggleSubmenu: () => void
  onOpenSubmenu: () => void
}

function runLeafAction(item: SidebarItem, onNavigate: (href: string) => void) {
  if (item.onClick) {
    item.onClick()
    return
  }
  if (item.href) {
    onNavigate(item.href)
  }
}

export function NavItem({
  item,
  isSidebarExpanded,
  isOpen,
  currentPath,
  onNavigate,
  onExpand,
  onToggleSubmenu,
  onOpenSubmenu
}: Readonly<NavItemProps>) {
  const hasSub = hasSubItems(item)
  const hasHref = Boolean(item.href)
  const isHybrid = hasSub && hasHref
  const active = isItemActive(currentPath, item)
  const [isHovered, setIsHovered] = useState(false)
  const submenuVisible = isSidebarExpanded ? isOpen : isHovered
  const showTooltip = !isSidebarExpanded && !hasSub

  const handleClick = () => {
    if (!hasSub || hasHref) {
      runLeafAction(item, onNavigate)
      return
    }
    if (!isSidebarExpanded) {
      onExpand()
      onOpenSubmenu()
      return
    }
    onToggleSubmenu()
  }

  const handleToggle = () => onToggleSubmenu()

  const linkContent = (
    <NavLink
      active={active}
      hasSub={hasSub}
      isHybrid={isHybrid}
      isOpen={isOpen}
      isSidebarExpanded={isSidebarExpanded}
      item={item}
      onClick={handleClick}
      onToggle={handleToggle}
    />
  )

  return (
    <li
      className={styles.navItem}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showTooltip ? (
        <Tooltip
          data={item.label}
          extraClass={styles.sidebarTooltip}
          placement={TOOLTIP_PLACEMENTS.RIGHT}
        >
          {linkContent}
        </Tooltip>
      ) : (
        linkContent
      )}
      {hasSub && submenuVisible ? (
        <SidebarSubmenu
          currentPath={currentPath}
          flyout={!isSidebarExpanded}
          item={item}
          onNavigate={onNavigate}
        />
      ) : null}
    </li>
  )
}
