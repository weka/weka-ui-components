import type { SidebarItem, SidebarProps } from './types'

import { Fragment, useState } from 'react'
import clsx from 'clsx'

import { ChevronLeftIcon } from '../../icons'
import { NavItem } from './NavItem'
import { findActiveSubmenuKey } from './sidebarUtils'

import styles from './sidebar.module.scss'

const EXPAND_CHEVRON_WIDTH = 8
const EXPAND_CHEVRON_HEIGHT = 14

/**
 * Tracks which submenu is open as an accordion (one at a time). Defaults to the
 * route-derived `activeKey`; a manual toggle/open overrides it, and the override
 * is cleared whenever the active route changes so in-app navigation re-opens the
 * submenu for the new route.
 */
function useSubmenuOpenKey(activeKey: string | null) {
  const [manualOpenKey, setManualOpenKey] = useState<string | null | undefined>(
    undefined
  )
  const [lastActiveKey, setLastActiveKey] = useState(activeKey)

  if (activeKey !== lastActiveKey) {
    setLastActiveKey(activeKey)
    setManualOpenKey(undefined)
  }

  const openKey = manualOpenKey === undefined ? activeKey : manualOpenKey

  const toggleSubmenu = (key: string) =>
    setManualOpenKey((prev) => {
      const current = prev === undefined ? activeKey : prev
      return current === key ? null : key
    })

  const openSubmenu = (key: string) => setManualOpenKey(key)

  return { openKey, toggleSubmenu, openSubmenu }
}

export function Sidebar({
  items,
  footerItems,
  currentPath,
  onNavigate,
  logo,
  logoCollapsed,
  defaultExpanded = false,
  extraClass,
  dataTestId = 'sidebar'
}: Readonly<SidebarProps>) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const expand = () => setIsExpanded(true)

  const activeKey = findActiveSubmenuKey(
    [...items, ...(footerItems ?? [])],
    currentPath
  )
  const { openKey, toggleSubmenu, openSubmenu } = useSubmenuOpenKey(activeKey)

  const renderItem = (item: SidebarItem) => (
    <Fragment key={item.key}>
      {item.dividerBefore ? (
        <li
          aria-hidden
          className={styles.separator}
        />
      ) : null}
      <NavItem
        currentPath={currentPath}
        isOpen={openKey === item.key}
        isSidebarExpanded={isExpanded}
        item={item}
        onExpand={expand}
        onNavigate={onNavigate}
        onOpenSubmenu={() => openSubmenu(item.key)}
        onToggleSubmenu={() => toggleSubmenu(item.key)}
      />
    </Fragment>
  )

  return (
    <aside
      data-testid={dataTestId}
      className={clsx(
        styles.sidebar,
        isExpanded && styles.expanded,
        extraClass
      )}
    >
      <button
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        className={styles.expandButton}
        onClick={() => setIsExpanded((prev) => !prev)}
        type='button'
      >
        <span
          className={clsx(
            styles.expandIconWrapper,
            isExpanded && styles.rotated
          )}
        >
          <ChevronLeftIcon
            color='white'
            height={EXPAND_CHEVRON_HEIGHT}
            width={EXPAND_CHEVRON_WIDTH}
          />
        </span>
      </button>
      <div className={styles.sidebarContent}>
        {logo || logoCollapsed ? (
          <div className={styles.headerSection}>
            <div className={styles.topLogoWrapper}>
              <div className={styles.logoCompact}>{logoCollapsed ?? logo}</div>
              <div className={styles.logoFull}>{logo}</div>
            </div>
          </div>
        ) : null}
        <nav className={styles.nav}>
          <ul>{items.map(renderItem)}</ul>
        </nav>
        {footerItems?.length ? (
          <div className={styles.bottomSection}>
            <div className={styles.bottomNav}>
              <ul>{footerItems.map(renderItem)}</ul>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
