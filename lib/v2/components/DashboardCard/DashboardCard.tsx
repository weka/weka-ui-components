import type { Severity } from '#v2/utils/consts'
import type { ReactNode } from 'react'

import clsx from 'clsx'

import { InfoIcon } from '../../icons'
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
  /**
   * When true the card hugs its content height instead of the default fixed
   * dashboard height. Use for compact summary cards (e.g. a single capacity
   * readout) that shouldn't reserve a full chart-sized panel.
   */
  fitContent?: boolean
  /**
   * When true the card drops its own border, shadow and background so it can
   * sit as one pane inside a shared outer frame (e.g. a split block whose two
   * halves are separated by a divider rather than each being its own card).
   */
  frameless?: boolean
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
  dataTestId,
  fitContent = false,
  frameless = false
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
      data-testid={dataTestId}
      className={clsx(styles.card, {
        [styles.fitContent]: fitContent,
        [styles.frameless]: frameless
      })}
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
