import clsx from 'clsx'

import { Tooltip } from '../../Tooltip'
import { SERIES_TYPES, type SeriesConfig } from '../chartTypes'
import { resolveSeriesColor } from '../utils/seriesColor'

import styles from './customLegend.module.scss'

const SHOW_ALL_LABEL = 'Show All'
const HIDE_ALL_LABEL = 'Hide All'

export interface CustomLegendProps {
  series: SeriesConfig[]
  hiddenMetrics?: Set<string>
  onShowAll?: () => void
  onHideAll?: () => void
  toggleMetric?: (key: string) => void
  shouldShowAllBtn?: boolean
  shouldHideAllBtn?: boolean
}

export function CustomLegend({
  series,
  hiddenMetrics,
  onShowAll,
  onHideAll,
  toggleMetric,
  shouldShowAllBtn,
  shouldHideAllBtn
}: Readonly<CustomLegendProps>) {
  return (
    <div className={styles.legendContainer}>
      {series.map((seriesItem) => {
        const isHidden = hiddenMetrics?.has(seriesItem.key)
        const isDisabled = Boolean(seriesItem.legendDisabled)
        const isLine = seriesItem.type === SERIES_TYPES.LINE
        const swatchColor = resolveSeriesColor(seriesItem.color)
        const handleClick = () => {
          if (isDisabled) {
            return
          }
          toggleMetric?.(seriesItem.key)
        }
        return (
          <button
            key={seriesItem.key}
            aria-disabled={isDisabled}
            aria-label={seriesItem.name}
            onClick={handleClick}
            type='button'
            className={clsx(styles.legendItem, {
              [styles.hidden]: isHidden,
              [styles.disabled]: isDisabled
            })}
          >
            <div
              className={clsx(styles.legendDot, isLine && styles.line)}
              style={{
                backgroundColor: isLine ? 'transparent' : swatchColor,
                borderColor: isLine ? swatchColor : 'transparent'
              }}
            />
            <Tooltip
              data={seriesItem.legendTooltip ?? seriesItem.name}
              ellipsis={!seriesItem.legendTooltip}
              extraClass={styles.legendTooltip}
            >
              <span className={styles.legendLabel}>{seriesItem.name}</span>
            </Tooltip>
          </button>
        )
      })}
      {shouldShowAllBtn || shouldHideAllBtn ? (
        <div className={styles.legendActions}>
          {shouldShowAllBtn ? (
            <button
              className={styles.legendButton}
              onClick={onShowAll}
              type='button'
            >
              {SHOW_ALL_LABEL}
            </button>
          ) : null}
          {shouldHideAllBtn ? (
            <button
              className={styles.legendButton}
              onClick={onHideAll}
              type='button'
            >
              {HIDE_ALL_LABEL}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
