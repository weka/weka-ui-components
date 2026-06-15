import type { MouseEventHandler, ReactNode } from 'react'

import clsx from 'clsx'

import styles from './iconButton.module.scss'

const DEFAULT_MAX_BADGE_COUNT = 98

export interface IconButtonProps {
  /** The icon to render (24–28px glyph centered in the 40px button). */
  children: ReactNode
  /** Accessible name — the button renders no visible text. */
  ariaLabel: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  /** Renders a count badge in the top-right corner when greater than 0. */
  badgeCount?: number
  /** Counts above this render as "N+" (default 98 → "98+"). */
  maxBadgeCount?: number
  disabled?: boolean
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
  extraClass,
  dataTestId
}: Readonly<IconButtonProps>) {
  return (
    <button
      aria-label={ariaLabel}
      className={clsx(styles.iconButton, extraClass)}
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
