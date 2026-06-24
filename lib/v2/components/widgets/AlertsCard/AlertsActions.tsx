import { type RefObject, useRef, useState } from 'react'
import clsx from 'clsx'

import { ArrowIcon, LinkIcon, SettingsIcon } from '../../../icons'
import { MenuPopover } from '../../MenuPopover'
import {
  ALERT_SORT_FIELDS,
  type AlertSortField,
  SORT_ORDERS,
  type SortOrder
} from './alertsCardUtils'

import styles from './alertsActions.module.scss'

const LINK_ICON_SIZE = 20

const SORT_OPTIONS = [
  ALERT_SORT_FIELDS.SEVERITY,
  ALERT_SORT_FIELDS.DATE
] as const

export interface AlertsActionsLabels {
  sortBy: string
  severity: string
  date: string
  showMuted: string
}

const DEFAULT_LABELS: AlertsActionsLabels = {
  sortBy: 'Sort by',
  severity: 'Severity',
  date: 'Date',
  showMuted: 'Show Muted'
}

export interface AlertsActionsProps {
  sortField: AlertSortField
  sortOrder: SortOrder
  onChange: (field: AlertSortField, order: SortOrder) => void
  showMuted: boolean
  onToggleMuted: () => void
  onLinkClick?: () => void
  labels?: Partial<AlertsActionsLabels>
  dataTestId?: string
}

/**
 * Settings control for the AlertsCard header: a gear that opens a popover to
 * sort by severity or date (re-selecting the active field flips the order) and
 * a "show muted" toggle, plus an optional link button (e.g. open the full alerts
 * view). Prop-only; the parent owns the sort/muted state and passes it to both
 * this control and the AlertsCard.
 */
export function AlertsActions({
  sortField,
  sortOrder,
  onChange,
  showMuted,
  onToggleMuted,
  onLinkClick,
  labels,
  dataTestId
}: Readonly<AlertsActionsProps>) {
  const text = { ...DEFAULT_LABELS, ...labels }
  const [open, setOpen] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  const sortLabels: Record<AlertSortField, string> = {
    [ALERT_SORT_FIELDS.SEVERITY]: text.severity,
    [ALERT_SORT_FIELDS.DATE]: text.date
  }

  const handleSelect = (field: AlertSortField) => {
    const flippedOrder =
      sortOrder === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : SORT_ORDERS.ASC
    const nextOrder = field === sortField ? flippedOrder : SORT_ORDERS.DESC
    onChange(field, nextOrder)
    setOpen(false)
  }

  return (
    <div
      className={styles.actionsContainer}
      data-testid={dataTestId}
    >
      <button
        ref={menuBtnRef}
        aria-label={text.sortBy}
        onClick={() => setOpen((value) => !value)}
        type='button'
        className={clsx(styles.menuIconBtn, {
          [styles.menuIconBtnActive]: open
        })}
      >
        <SettingsIcon />
      </button>
      {onLinkClick ? (
        <button
          className={styles.linkBtn}
          data-testid='alerts-card-link-button'
          onClick={onLinkClick}
          type='button'
        >
          <LinkIcon
            height={LINK_ICON_SIZE}
            width={LINK_ICON_SIZE}
          />
        </button>
      ) : null}
      <MenuPopover
        anchorRef={menuBtnRef as unknown as RefObject<HTMLElement>}
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className={styles.alertsPopoverList}>
          <div className={styles.sortTitle}>{text.sortBy}</div>
          {SORT_OPTIONS.map((field) => (
            <button
              key={field}
              className={styles.alertsMenuItem}
              onClick={() => handleSelect(field)}
              type='button'
            >
              <ArrowIcon
                direction={sortOrder}
                extraClass={clsx(styles.sortArrow, {
                  [styles.inactiveArrow]: sortField !== field
                })}
              />
              <span>{sortLabels[field]}</span>
            </button>
          ))}
          <div className={styles.separator} />
          <label className={styles.mutedOption}>
            <input
              checked={showMuted}
              className={styles.mutedCheckbox}
              onChange={onToggleMuted}
              type='checkbox'
            />
            <span className={styles.mutedLabel}>{text.showMuted}</span>
          </label>
        </div>
      </MenuPopover>
    </div>
  )
}
