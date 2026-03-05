import type { ReactNode } from 'react'
import clsx from 'clsx'

import styles from './loadingState.module.scss'

const STATE_TYPES = {
  LOADING: 'loading',
  ERROR: 'error',
  NO_DATA: 'noData'
} as const

type StateType = (typeof STATE_TYPES)[keyof typeof STATE_TYPES]

const TEST_IDS: Record<StateType, string> = {
  [STATE_TYPES.LOADING]: 'loading-state',
  [STATE_TYPES.ERROR]: 'error-state',
  [STATE_TYPES.NO_DATA]: 'empty-state'
}

const DEFAULT_MESSAGES: Record<StateType, string> = {
  [STATE_TYPES.LOADING]: 'Loading...',
  [STATE_TYPES.ERROR]: 'Error loading data',
  [STATE_TYPES.NO_DATA]: 'No data available'
}

export interface LoadingStateProps {
  type: StateType
  message?: string
  children?: ReactNode
}

export function LoadingState({
  type,
  message,
  children
}: Readonly<LoadingStateProps>) {
  const displayMessage = message ?? DEFAULT_MESSAGES[type]

  return (
    <div
      className={clsx(styles.container, styles[type])}
      data-testid={TEST_IDS[type]}
    >
      <div className={styles.content}>
        {type === STATE_TYPES.LOADING && (
          <div className={styles.spinner}>
            <div className={styles.spinnerDot} />
            <div className={styles.spinnerDot} />
            <div className={styles.spinnerDot} />
            <div className={styles.spinnerDot} />
          </div>
        )}
        <div className={styles.message}>{displayMessage}</div>
        {children}
      </div>
    </div>
  )
}

export default LoadingState
