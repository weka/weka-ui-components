import type { ReactNode } from 'react'

import { InfoIcon } from '../../icons'
import type { Severity } from '../../utils/consts'
import { AlertBadge } from '../AlertBadge'
import { Tooltip } from '../Tooltip'

import styles from './dashboardCard.module.scss'

export interface DashboardCardProps {
  title: string
  subtitle?: ReactNode
  tooltip?: string
  count?: number
  actions?: ReactNode
  children: ReactNode
  severity?: Severity
  dataTestId?: string
}

const MAX_DISPLAY_COUNT = 99

export const DASHBOARD_CARD_TEST_IDS = {
  COUNT: 'card-count'
} as const

export function DashboardCard({
  title,
  subtitle,
  tooltip,
  count,
  severity,
  actions,
  children,
  dataTestId
}: Readonly<DashboardCardProps>) {
  const getDisplayCount = (): string | null => {
    if (typeof count === 'number' && count > 0) {
      return count > MAX_DISPLAY_COUNT ? `${MAX_DISPLAY_COUNT}+` : String(count)
    }
    return null
  }
  const displayCount = getDisplayCount()

  return (
    <div
      className={styles.card}
      data-testid={dataTestId}
    >
      <div className={styles.headerContainer}>
        <div className={styles.titleBlock}>
          <div className={styles.titleWrapper}>
            <h3
              className={styles.title}
              data-testid={dataTestId ? `${dataTestId}-title` : undefined}
            >
              {title}
            </h3>
            {tooltip ? (
              <Tooltip data={tooltip}>
                <span className={styles.infoIcon}>
                  <InfoIcon />
                </span>
              </Tooltip>
            ) : null}
          </div>
          {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
        </div>
        <div className={styles.actions}>
          {displayCount !== null && !severity && (
            <span
              className={styles.badge}
              data-testid={
                dataTestId
                  ? `${dataTestId}-count`
                  : DASHBOARD_CARD_TEST_IDS.COUNT
              }
            >
              {displayCount}
            </span>
          )}
          {displayCount !== null && severity ? (
            <AlertBadge
              count={count}
              severity={severity}
              dataTestId={
                dataTestId
                  ? `${dataTestId}-count`
                  : DASHBOARD_CARD_TEST_IDS.COUNT
              }
            />
          ) : null}
          {actions}
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
