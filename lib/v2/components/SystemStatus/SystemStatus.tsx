import type { ProtectionStatusInfo } from '#v2/utils/protectionStatus'

import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'
import {
  getStatusColorClass,
  mapLegacyStatus
} from '#v2/utils/protectionStatus'

import styles from './systemStatus.module.scss'

export interface SystemStatusProps {
  status: string
  statusInfo?: Pick<ProtectionStatusInfo, 'label' | 'color'>
  showProgress?: boolean
  progress?: number
  extraClass?: string
}

export function SystemStatus({
  status,
  statusInfo,
  showProgress = false,
  progress,
  extraClass
}: Readonly<SystemStatusProps>) {
  const protectionStatus = statusInfo ?? mapLegacyStatus(status)
  const colorClass =
    styles[getStatusColorClass(protectionStatus.color)] ?? EMPTY_STRING

  return (
    <div
      className={clsx(styles.systemStatus, colorClass, extraClass)}
      data-testid='cluster-status'
    >
      <div className={styles.circle} />
      <span className={styles.text}>{protectionStatus.label}</span>
      {showProgress && typeof progress === 'number' ? (
        <span className={styles.progress}>{progress.toFixed(1)}%</span>
      ) : null}
    </div>
  )
}
