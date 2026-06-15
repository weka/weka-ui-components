import type { ReactNode } from 'react'

import { Fragment } from 'react'
import clsx from 'clsx'

import styles from './headerMetaBanner.module.scss'

export interface HeaderMetaItem {
  key: string
  label: string
  value: ReactNode
  /** Optional element rendered after the value (e.g. a toggle button). */
  trailing?: ReactNode
}

export interface HeaderMetaBannerProps {
  items: HeaderMetaItem[]
  /** Optional element rendered before the items (e.g. a status chip). */
  leading?: ReactNode
  extraClass?: string
}

export function HeaderMetaBanner({
  items,
  leading,
  extraClass
}: Readonly<HeaderMetaBannerProps>) {
  return (
    <div className={clsx(styles.metaBanner, extraClass)}>
      {leading}
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 || leading ? <span className={styles.spacer} /> : null}
          <div className={styles.metaAtom}>
            <span className={styles.metaLabel}>{item.label}</span>
            <span className={styles.metaValue}>{item.value}</span>
            {item.trailing}
          </div>
        </Fragment>
      ))}
    </div>
  )
}
