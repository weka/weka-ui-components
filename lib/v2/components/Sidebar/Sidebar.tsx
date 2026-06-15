import type { SidebarItem, SidebarProps } from './types'

import { Fragment, useState } from 'react'
import clsx from 'clsx'

import { ChevronLeftIcon } from '../../icons'
import { NavItem } from './NavItem'

import styles from './sidebar.module.scss'

const EXPAND_CHEVRON_WIDTH = 8
const EXPAND_CHEVRON_HEIGHT = 14

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
        isSidebarExpanded={isExpanded}
        item={item}
        onExpand={expand}
        onNavigate={onNavigate}
      />
    </Fragment>
  )

  return (
    <aside
      className={clsx(styles.sidebar, isExpanded && styles.expanded, extraClass)}
      data-testid={dataTestId}
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
