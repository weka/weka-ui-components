import type { Tab, TabVariant } from '../tabsConstants'

import { formatCountWithMax } from '#v2/utils/textUtils'

import { TAB_VARIANTS } from '../tabsConstants'

import styles from '../tabs.module.scss'

interface TabCountProps {
  tab: Tab
  variant: TabVariant
}

export function TabCount({ tab, variant }: Readonly<TabCountProps>) {
  if (tab.count === undefined) {
    return null
  }

  const countText = formatCountWithMax(tab.count, tab.maxCount)
  return (
    <span className={styles.tabCount}>
      {variant === TAB_VARIANTS.UNDERLINE ? `(${countText})` : countText}
    </span>
  )
}
