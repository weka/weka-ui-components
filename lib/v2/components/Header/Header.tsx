import type { ReactNode } from 'react'

import clsx from 'clsx'

import styles from './header.module.scss'

export interface HeaderProps {
  /** Content for the left region (e.g. meta banner, switcher). */
  leftContent?: ReactNode
  /** Content for the centre region (e.g. an alert carousel). */
  centerContent?: ReactNode
  /** Content for the right region (e.g. action icon buttons). */
  rightContent?: ReactNode
  /** Applied to the root bar — for consumer-specific layout (e.g. edge bleed). */
  extraClass?: string
  dataTestId?: string
}

export function Header({
  leftContent,
  centerContent,
  rightContent,
  extraClass,
  dataTestId = 'header'
}: Readonly<HeaderProps>) {
  return (
    <header
      className={clsx(styles.header, extraClass)}
      data-testid={dataTestId}
    >
      <div className={styles.leftContent}>{leftContent}</div>
      {centerContent ? (
        <div className={styles.centerContent}>{centerContent}</div>
      ) : null}
      <div className={styles.rightContent}>{rightContent}</div>
    </header>
  )
}
