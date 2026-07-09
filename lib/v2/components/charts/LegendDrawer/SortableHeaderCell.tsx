import clsx from 'clsx'

import { SortIndicator } from './SortIndicator'

import styles from './legendDrawer.module.scss'

interface SortableHeaderCellProps {
  label: string
  headerClass: string
  labelClass?: string
  isActive: boolean
  sortAscending: boolean
  notSortable: boolean
  onSort: () => void
}

export function SortableHeaderCell({
  label,
  headerClass,
  labelClass,
  isActive,
  sortAscending,
  notSortable,
  onSort
}: Readonly<SortableHeaderCellProps>) {
  return (
    <div
      className={clsx(headerClass, { [styles.notSortable]: notSortable })}
      onClick={notSortable ? undefined : onSort}
    >
      <span className={labelClass}>{label}</span>
      {!notSortable && (
        <SortIndicator
          isActive={isActive}
          sortAscending={sortAscending}
        />
      )}
    </div>
  )
}
