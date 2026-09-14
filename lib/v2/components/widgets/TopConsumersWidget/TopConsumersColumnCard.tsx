import type { TopConsumersColumn, TopConsumersItem } from './types'

import { useMemo } from 'react'

import { LinkIcon } from '../../../icons'
import { Chip } from '../../Chip'
import { EmptyChartState } from '../../EmptyChartState'
import { IconButton } from '../../IconButton'
import { LoadingState, STATE_TYPES } from '../../LoadingState'

import styles from './topConsumersWidget.module.scss'

const EMPTY_STATE_HEIGHT = 120
const DEFAULT_EMPTY_MESSAGE = 'No data'
const PERCENT = 100
const BADGE_COLOR = 'var(--purple-700-300)'
const LINK_ICON_SIZE = 20

const topItems = (items: TopConsumersItem[], maxItems: number) =>
  [...items]
    .sort((first, second) => second.value - first.value)
    .slice(0, maxItems)

/**
 * The gradient is laid out across the whole track and revealed by the bar's
 * width, so a half-full bar shows the first half of the gradient rather than
 * the whole gradient squeezed into half the track.
 */
const barStyle = (value: number, max: number, fill: string) => {
  const ratio = max > 0 ? Math.max(0, value / max) : 0
  return {
    width: `${ratio * PERCENT}%`,
    background: fill,
    backgroundSize: ratio > 0 ? `${PERCENT / ratio}% 100%` : undefined
  }
}

/** The footer describes the listed rows, so it only accompanies a rendered list. */
const hasShareFooter = (column: TopConsumersColumn, rowCount: number) =>
  rowCount > 0 &&
  !column.isLoading &&
  !column.isError &&
  column.shareOfTotal !== undefined &&
  column.shareLabel !== undefined

export interface TopConsumersColumnCardProps {
  column: TopConsumersColumn
  gradient: NonNullable<TopConsumersColumn['gradient']>
  maxItems: number
  dataTestId?: string
}

/**
 * One ranked list: title (plus optional tag), up to `maxItems` rows with a
 * horizontal bar scaled to the largest value, and a "Top N = X% of …" footer
 * when the column knows its share of the total.
 */
export function TopConsumersColumnCard({
  column,
  gradient,
  maxItems,
  dataTestId
}: Readonly<TopConsumersColumnCardProps>) {
  const rows = useMemo(
    () => topItems(column.items, maxItems),
    [column.items, maxItems]
  )
  const max = rows[0]?.value ?? 0
  const fill = `linear-gradient(90deg, ${gradient.start} 0%, ${gradient.end} 100%)`
  const showFooter = hasShareFooter(column, rows.length)

  const renderBody = () => {
    if (column.isLoading) {
      return <LoadingState type={STATE_TYPES.LOADING} />
    }
    if (column.isError) {
      return <LoadingState type={STATE_TYPES.ERROR} />
    }
    if (rows.length === 0) {
      return (
        <EmptyChartState
          height={EMPTY_STATE_HEIGHT}
          message={column.emptyMessage ?? DEFAULT_EMPTY_MESSAGE}
        />
      )
    }
    return (
      <ol className={styles.rows}>
        {rows.map((item) => (
          <li
            key={item.name}
            className={styles.row}
          >
            <div className={styles.rowHeader}>
              <span
                className={styles.name}
                title={item.name}
              >
                {item.name}
              </span>
              <span className={styles.value}>
                {column.formatValue(item.value)}
                {item.secondaryValue !== undefined &&
                column.formatSecondaryValue ? (
                  <span className={styles.secondary}>
                    {column.formatSecondaryValue(item.secondaryValue)}
                  </span>
                ) : null}
              </span>
            </div>
            <div
              aria-hidden='true'
              className={styles.track}
            >
              <div
                className={styles.bar}
                data-testid={dataTestId ? `${dataTestId}-bar` : undefined}
                style={barStyle(item.value, max, fill)}
              />
            </div>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <section
      aria-label={column.title}
      className={styles.card}
      data-testid={dataTestId}
    >
      <header className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{column.title}</h3>
        <div className={styles.cardHeaderActions}>
          {column.badge ? (
            <Chip
              borderColor={BADGE_COLOR}
              extraClass={styles.badge}
              textColor={BADGE_COLOR}
            >
              {column.badge}
            </Chip>
          ) : null}
          {column.onNavigate ? (
            <IconButton
              ariaLabel={column.navigateLabel ?? `Open ${column.title}`}
              dataTestId={dataTestId ? `${dataTestId}-link` : undefined}
              onClick={column.onNavigate}
              small
            >
              <LinkIcon
                height={LINK_ICON_SIZE}
                width={LINK_ICON_SIZE}
              />
            </IconButton>
          ) : null}
        </div>
      </header>
      <div className={styles.body}>{renderBody()}</div>
      {showFooter ? (
        <p className={styles.footer}>
          Top {rows.length} = {Math.round((column.shareOfTotal ?? 0) * PERCENT)}
          % of {column.shareLabel}
        </p>
      ) : null}
    </section>
  )
}
