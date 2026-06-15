import type { SidebarItem } from '../types'
import type SimpleBarCore from 'simplebar-core'

import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import SimpleBar from 'simplebar-react'

import { isPathActive } from '../sidebarUtils'

import 'simplebar-react/dist/simplebar.min.css'
import styles from './sidebarSubmenu.module.scss'

interface SidebarSubmenuProps {
  item: SidebarItem
  currentPath: string
  /** Render as a floating panel to the right of the collapsed rail instead of inline. */
  flyout: boolean
  onNavigate: (href: string) => void
}

export function SidebarSubmenu({
  item,
  currentPath,
  flyout,
  onNavigate
}: Readonly<SidebarSubmenuProps>) {
  const scrollRef = useRef<SimpleBarCore | null>(null)
  const scrollable = Boolean(item.scrollableSubmenu)

  useEffect(() => {
    if (!scrollable) {
      return
    }
    const activeEl = scrollRef.current
      ?.getScrollElement()
      ?.querySelector(`.${styles.active}`)
    activeEl?.scrollIntoView({ block: 'nearest' })
  }, [scrollable, currentPath])

  const subListItems = item.subItems?.map((subItem) => (
    <li
      key={subItem.key}
      className={styles.subItem}
    >
      <button
        disabled={!subItem.href}
        type='button'
        className={clsx(
          styles.subNavLink,
          isPathActive(currentPath, subItem.href) && styles.active
        )}
        onClick={
          subItem.href ? () => onNavigate(subItem.href as string) : undefined
        }
      >
        <span className={styles.navLinkText}>{subItem.label}</span>
        {subItem.badge ? (
          <span
            className={clsx(
              styles.badge,
              subItem.badgeColor ? styles[subItem.badgeColor] : styles.default
            )}
          >
            {subItem.badge}
          </span>
        ) : null}
      </button>
    </li>
  ))

  const list = <ul className={styles.submenuList}>{subListItems}</ul>

  return (
    <div className={clsx(styles.subItems, flyout && styles.flyout)}>
      {scrollable ? (
        <SimpleBar
          ref={scrollRef}
          autoHide={false}
          className={styles.simplebarContainer}
        >
          {list}
        </SimpleBar>
      ) : (
        list
      )}
    </div>
  )
}
