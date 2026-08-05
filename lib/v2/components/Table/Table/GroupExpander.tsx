import type { Row } from '@tanstack/react-table'
import type { MouseEvent } from 'react'

import clsx from 'clsx'

import { ICON_SIZES } from '#v2/utils/consts'

import { ChevronDownSmallIcon } from '../../../icons'

import styles from './table.module.scss'

const EXPANDER_LABELS = {
  EXPAND: 'Expand group',
  COLLAPSE: 'Collapse group'
} as const

interface GroupExpanderProps<TData> {
  readonly row: Row<TData>
}

/**
 * Chevron toggle rendered inside a grouped cell. Points down while the group is
 * open and rotates to point right once it collapses.
 */
export function GroupExpander<TData>({
  row
}: Readonly<GroupExpanderProps<TData>>) {
  const isExpanded = row.getIsExpanded()

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
    row.toggleExpanded()
  }

  return (
    <button
      aria-expanded={isExpanded}
      className={styles.groupExpander}
      data-testid={`group-expander-${row.id}`}
      onClick={handleClick}
      type='button'
      aria-label={
        isExpanded ? EXPANDER_LABELS.COLLAPSE : EXPANDER_LABELS.EXPAND
      }
    >
      <ChevronDownSmallIcon
        height={ICON_SIZES.MD}
        width={ICON_SIZES.MD}
        extraClass={clsx(
          styles.groupExpanderIcon,
          !isExpanded && styles.collapsed
        )}
      />
    </button>
  )
}
