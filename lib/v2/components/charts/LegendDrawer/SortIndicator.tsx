import clsx from 'clsx'

import { SortIcon, SortUpDownIcon } from '../../../icons'

import styles from './legendDrawer.module.scss'

const SORT_ICON_SIZE = 14

interface SortIndicatorProps {
  isActive: boolean
  sortAscending: boolean
}

export function SortIndicator({
  isActive,
  sortAscending
}: Readonly<SortIndicatorProps>) {
  if (isActive) {
    return (
      <SortIcon
        extraClass={clsx(styles.sortIcon, {
          [styles.sortAsc]: sortAscending,
          [styles.sortDesc]: !sortAscending
        })}
      />
    )
  }

  return (
    <>
      <SortIcon extraClass={clsx(styles.sortIcon, styles.sortInactive)} />
      <SortUpDownIcon
        extraClass={clsx(styles.sortIcon, styles.sortUpDown)}
        height={SORT_ICON_SIZE}
        width={SORT_ICON_SIZE}
      />
    </>
  )
}
