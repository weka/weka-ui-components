import type { HTMLAttributes, ReactNode } from 'react'

import { Children, forwardRef, isValidElement } from 'react'
import clsx from 'clsx'

import styles from './select.module.scss'

interface SplitMenuListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

function isSearchMenuItem(
  element: ReturnType<typeof Children.toArray>[0]
): boolean {
  if (!isValidElement<{ className?: string }>(element)) {
    return false
  }
  const { className } = element.props
  return (
    typeof className === 'string' && className.includes(styles.searchMenuItem)
  )
}

const splitMenuList = forwardRef<HTMLDivElement, SplitMenuListProps>(
  (props, ref) => {
    const { children, className, ...other } = props
    const items = Children.toArray(children)

    const hasSearch = items.length > 0 && isSearchMenuItem(items[0])
    const searchItem = hasSearch ? items[0] : null
    const listItems = hasSearch ? items.slice(1) : items

    return (
      <div
        ref={ref}
        className={clsx(className, styles.menuListWrapper)}
        {...other}
      >
        {searchItem ? (
          <div className={styles.stickyHeader}>{searchItem}</div>
        ) : null}
        <ul className={styles.scrollableList}>{listItems}</ul>
      </div>
    )
  }
)

splitMenuList.displayName = 'SplitMenuList'

export { splitMenuList as SplitMenuList }
