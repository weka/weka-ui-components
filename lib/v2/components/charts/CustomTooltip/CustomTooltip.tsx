import clsx from 'clsx'

import { EMPTY_STRING } from '#v2/utils/consts'
import { formatTimestamp } from '#v2/utils/timeUtils'

import { DateTimeIcon } from '../../../icons'
import { type SeriesConfig, type TooltipPayloadItem } from '../chartTypes'

import styles from './customTooltip.module.scss'

const DEFAULT_TOTAL_KEY = 'total'
const MIN_TIMESTAMP_MS = 1000000000000
const DATE_ICON_SIZE = 16

export interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  series: SeriesConfig[]
  range?: string
  isCustomRange?: boolean
  valueFormatter?: (value: number) => string
  getCustomTooltipLabel?: (label: string) => string
  getAdditionalTooltipInfo?: (
    payload: TooltipPayloadItem['payload']
  ) => string[]
  valueAlignment?: 'left' | 'right'
  sortValuesDescending?: boolean
  totalKey?: string
}

export function CustomTooltip({
  active,
  payload,
  label,
  series,
  valueFormatter,
  getCustomTooltipLabel,
  getAdditionalTooltipInfo,
  valueAlignment = 'right',
  sortValuesDescending = false,
  totalKey = DEFAULT_TOTAL_KEY
}: Readonly<CustomTooltipProps>) {
  if (active && payload && payload.length) {
    const formatTooltipTime = (timeLabel: string | undefined) => {
      if (!timeLabel) {
        return EMPTY_STRING
      }

      if (payload[0]?.payload?.timestamp) {
        return formatTimestamp(payload[0].payload.timestamp)
      }

      const numLabel = Number(timeLabel)
      if (!Number.isNaN(numLabel) && numLabel > MIN_TIMESTAMP_MS) {
        return formatTimestamp(numLabel)
      }

      return timeLabel
    }

    const additionalInfo = getAdditionalTooltipInfo?.(payload[0]?.payload) || []
    const hasTimestamp = Boolean(payload[0]?.payload?.timestamp)
    const formattedTime = formatTooltipTime(label)
    const customLabel = label ? getCustomTooltipLabel?.(label) : undefined

    const parseLabelValue = (text: string) => {
      const colonIndex = text.indexOf(':')
      if (colonIndex > 0) {
        return {
          label: text.substring(0, colonIndex).trim(),
          value: text.substring(colonIndex + 1).trim()
        }
      }
      return null
    }

    const customLabelParsed = customLabel ? parseLabelValue(customLabel) : null

    const orderedPayload = sortValuesDescending
      ? [...payload].sort((firstItem, secondItem) => {
          const firstIsTotal = firstItem.dataKey === totalKey
          const secondIsTotal = secondItem.dataKey === totalKey
          if (firstIsTotal !== secondIsTotal) {
            return firstIsTotal ? -1 : 1
          }
          const firstValue =
            typeof firstItem.value === 'number' ? firstItem.value : -Infinity
          const secondValue =
            typeof secondItem.value === 'number' ? secondItem.value : -Infinity
          return secondValue - firstValue
        })
      : payload

    const renderCustomLabel = () => {
      if (!customLabel) {
        return null
      }

      if (customLabelParsed) {
        return (
          <div className={styles.tooltipMetadataItem}>
            <span className={styles.tooltipLabel}>
              {customLabelParsed.label}
            </span>
            <span className={styles.tooltipValue}>
              {customLabelParsed.value}
            </span>
          </div>
        )
      }

      return (
        <div className={styles.tooltipMetadataItem}>
          <span className={styles.tooltipLabel}>Name</span>
          <span className={styles.tooltipValue}>{customLabel}</span>
        </div>
      )
    }

    return (
      <div
        className={styles.tooltip}
        data-testid='chart-tooltip'
      >
        {hasTimestamp && formattedTime ? (
          <div className={styles.tooltipHeader}>
            <DateTimeIcon
              extraClass={styles.tooltipIcon}
              height={DATE_ICON_SIZE}
              width={DATE_ICON_SIZE}
            />
            {formattedTime}
          </div>
        ) : null}
        {renderCustomLabel()}
        {additionalInfo.map((info, index) => {
          const parsed = parseLabelValue(info)
          return parsed ? (
            <div
              key={index}
              className={styles.tooltipMetadataItem}
            >
              <span className={styles.tooltipLabel}>{parsed.label}</span>
              <span className={styles.tooltipValue}>{parsed.value}</span>
            </div>
          ) : (
            <div
              key={index}
              className={styles.tooltipHeader}
            >
              {info}
            </div>
          )
        })}
        {orderedPayload.map((payloadItem) => {
          const seriesItem = series.find(
            (seriesConfig) => seriesConfig.key === payloadItem.dataKey
          )
          const itemName = seriesItem?.name || payloadItem.name
          const isTotal =
            seriesItem?.key === totalKey || payloadItem.dataKey === totalKey
          const dotColor = seriesItem?.color || payloadItem.color

          return (
            <div
              key={payloadItem.dataKey}
              className={clsx(styles.tooltipItem, {
                [styles.totalItem]: isTotal,
                [styles.leftAlignedItem]: valueAlignment === 'left'
              })}
            >
              <div className={styles.tooltipItemLeft}>
                <div
                  className={styles.tooltipDot}
                  style={{ backgroundColor: dotColor }}
                />
                <span className={styles.tooltipLabel}>
                  {isTotal && typeof itemName === 'string'
                    ? itemName.toUpperCase()
                    : itemName}
                </span>
              </div>
              <span
                className={clsx(styles.tooltipValue, {
                  [styles.leftAligned]: valueAlignment === 'left'
                })}
              >
                {payloadItem.formattedValue ??
                  (valueFormatter && typeof payloadItem.value === 'number'
                    ? valueFormatter(payloadItem.value)
                    : payloadItem.value)}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}
