import type { ReactNode } from 'react'

import clsx from 'clsx'

import gradient1 from '../../assets/weka-gradient-1.png'
import gradient2 from '../../assets/weka-gradient-2.png'
import gradient3 from '../../assets/weka-gradient-3.png'
import gradient4 from '../../assets/weka-gradient-4.png'

import styles from './errorPage.module.scss'

const GRID_FILLER_TOP = 6
const GRID_FILLER_TRIPLE = 3
const GRID_FILLER_MID = 5
const GRID_FILLER_BOTTOM = 9

export interface ErrorPageProps {
  icon: ReactNode
  title: string
  message: string
  children?: ReactNode
  extraClass?: string
  dataTestId?: string
}

/**
 * Prop-only, router-agnostic error/status page scaffold shared by Observe
 * (NotFound, Maintenance) and wekapp NeuralMesh. Callers supply the icon,
 * copy, and any action (via `children`); the grid + gradient chrome is fixed.
 */
export function ErrorPage({
  icon,
  title,
  message,
  children,
  extraClass,
  dataTestId = 'error-page'
}: Readonly<ErrorPageProps>) {
  return (
    <div
      className={clsx(styles.wrapper, extraClass)}
      data-testid={dataTestId}
    >
      <div className={styles.container}>
        <div className={styles.iconWrapper}>{icon}</div>
        {Array.from({ length: GRID_FILLER_TOP }, (_, i) => (
          <div key={`top.${i}`} />
        ))}
        <div className={styles.contentArea}>
          <h1 className={styles.pageTitle}>{title}</h1>
          <p className={styles.message}>{message}</p>
          {children}
        </div>
        {Array.from({ length: GRID_FILLER_TRIPLE }, (_, i) => (
          <div key={`triple.${i}`} />
        ))}
        <div
          className={styles.gradient3}
          style={{ backgroundImage: `url(${gradient3})` }}
        />
        <div />
        <div
          className={styles.gradient1}
          style={{ backgroundImage: `url(${gradient1})` }}
        />
        {Array.from({ length: GRID_FILLER_MID }, (_, i) => (
          <div key={`mid.${i}`} />
        ))}
        <div />
        <div />
        {Array.from({ length: GRID_FILLER_BOTTOM }, (_, i) => (
          <div key={`bottom.${i}`} />
        ))}
        <div
          className={styles.gradient2}
          style={{ backgroundImage: `url(${gradient2})` }}
        />
        <div
          className={styles.gradient4}
          style={{ backgroundImage: `url(${gradient4})` }}
        />
      </div>
    </div>
  )
}
