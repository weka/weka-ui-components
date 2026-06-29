import type { Tab } from '../tabsConstants'

import { ICON_SIZES } from '#v2/utils/consts'

import styles from '../tabs.module.scss'

interface TabIconProps {
  isActive: boolean
  tab: Tab
}

export function TabIcon({ isActive, tab }: Readonly<TabIconProps>) {
  if (tab.Icon) {
    return (
      <span className={styles.tabIcon}>
        <tab.Icon
          color={isActive ? 'var(--purple-700-300)' : 'var(--gray-600-400)'}
          height={ICON_SIZES.LG}
          width={ICON_SIZES.LG}
        />
      </span>
    )
  }

  if (tab.icon) {
    return <span className={styles.tabIcon}>{tab.icon}</span>
  }

  return null
}
