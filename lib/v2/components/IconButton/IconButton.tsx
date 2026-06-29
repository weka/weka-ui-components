import type { MouseEventHandler, ReactNode } from 'react'

import clsx from 'clsx'

import styles from './iconButton.module.scss'

const DEFAULT_MAX_BADGE_COUNT = 98

export interface IconButtonProps {
  children: ReactNode
  ariaLabel: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  badgeCount?: number
  maxBadgeCount?: number
  disabled?: boolean
  small?: boolean
  extraClass?: string
  dataTestId?: string
}

function formatBadge(count: number, maxCount: number) {
  return count > maxCount ? `${maxCount}+` : `${count}`
}

export function IconButton({
  children,
  ariaLabel,
  onClick,
  badgeCount = 0,
  maxBadgeCount = DEFAULT_MAX_BADGE_COUNT,
  disabled = false,
  small = false,
  extraClass,
  dataTestId
}: Readonly<IconButtonProps>) {
  return (
    <button
      aria-label={ariaLabel}
      className={clsx(styles.iconButton, small && styles.small, extraClass)}
      data-testid={dataTestId}
      disabled={disabled}
      onClick={onClick}
      type='button'
    >
      {children}
      {badgeCount > 0 ? (
        <span className={styles.badge}>
          {formatBadge(badgeCount, maxBadgeCount)}
        </span>
      ) : null}
    </button>
  )
}
