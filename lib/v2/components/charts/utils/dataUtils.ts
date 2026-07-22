import type { TimeSeriesPoint } from '../chartTypes'

import { formatTooltipTimestamp } from './xAxisFormatters'

interface TimestampedValue {
  timestamp: number
  value: number
}

/**
 * Value at `targetTimestamp` for a raw time series: an exact match when one
 * exists, otherwise linear interpolation between the nearest surrounding
 * points (or the nearest edge point when `targetTimestamp` falls outside the
 * series). Returns `0` for an empty series.
 */
export function interpolateValue(
  rawData: TimestampedValue[],
  targetTimestamp: number
): number {
  if (rawData.length === 0) {
    return 0
  }

  const exactMatch = rawData.find(
    (point) => point.timestamp === targetTimestamp
  )
  if (exactMatch) {
    return exactMatch.value
  }

  const beforePoints = rawData.filter(
    (point) => point.timestamp < targetTimestamp
  )
  const afterPoints = rawData.filter(
    (point) => point.timestamp > targetTimestamp
  )

  if (beforePoints.length === 0) {
    return afterPoints.length > 0 ? afterPoints[0].value : 0
  }
  if (afterPoints.length === 0) {
    return beforePoints[beforePoints.length - 1].value
  }

  const beforePoint = beforePoints[beforePoints.length - 1]
  const afterPoint = afterPoints[0]
  const timeDiff = afterPoint.timestamp - beforePoint.timestamp
  const valueRange = afterPoint.value - beforePoint.value
  const targetProgress = (targetTimestamp - beforePoint.timestamp) / timeDiff

  return beforePoint.value + valueRange * targetProgress
}

/** Flat zero-value series at the given timestamps, for a series with no raw data of its own. */
export function generateZeroLineData(timestamps: number[]): TimeSeriesPoint[] {
  return timestamps.map((timestamp) => ({
    timestamp,
    time: formatTooltipTimestamp(timestamp),
    value: 0
  }))
}

const hasAnyTimestamp = (points: TimeSeriesPoint[]): boolean =>
  points.some((point) => point.timestamp !== undefined)

const toTimestampedValues = (points: TimeSeriesPoint[]): TimestampedValue[] =>
  points
    .filter((point) => point.timestamp !== undefined)
    .map((point) => ({
      timestamp: point.timestamp as number,
      value: point.value
    }))

/**
 * Aligns three raw series onto a single common timeline so the same array
 * index refers to the same instant in every returned series, letting callers
 * read matching points across all three by one shared index.
 *
 * When none of the incoming points carry a `timestamp`, the series are
 * assumed already positionally aligned (the common case for a single shared
 * data source) and are returned unchanged. Otherwise every unique timestamp
 * across the three series becomes a row, with missing values filled in by
 * interpolation (or a flat zero line for a series with no raw data at all).
 */
export function createCommonTimelineData(
  throughputRaw: TimeSeriesPoint[],
  iopsRaw: TimeSeriesPoint[],
  latencyRaw: TimeSeriesPoint[]
): {
  throughputData: TimeSeriesPoint[]
  iopsData: TimeSeriesPoint[]
  latencyData: TimeSeriesPoint[]
} {
  const isTimestamped =
    hasAnyTimestamp(throughputRaw) ||
    hasAnyTimestamp(iopsRaw) ||
    hasAnyTimestamp(latencyRaw)

  if (!isTimestamped) {
    return {
      throughputData: throughputRaw,
      iopsData: iopsRaw,
      latencyData: latencyRaw
    }
  }

  const allTimestamps = new Set<number>()
  ;[throughputRaw, iopsRaw, latencyRaw].forEach((points) => {
    points.forEach((point) => {
      if (point.timestamp !== undefined) {
        allTimestamps.add(point.timestamp)
      }
    })
  })

  const sortedTimestamps = Array.from(allTimestamps).sort(
    (first, second) => first - second
  )

  const alignToTimeline = (points: TimeSeriesPoint[]): TimeSeriesPoint[] => {
    if (points.length === 0) {
      return generateZeroLineData(sortedTimestamps)
    }

    const timestampedValues = toTimestampedValues(points)
    if (timestampedValues.length === 0) {
      return sortedTimestamps.map((timestamp, index) => ({
        timestamp,
        time: formatTooltipTimestamp(timestamp),
        value: points[index]?.value ?? 0
      }))
    }

    return sortedTimestamps.map((timestamp) => ({
      timestamp,
      time: formatTooltipTimestamp(timestamp),
      value: interpolateValue(timestampedValues, timestamp)
    }))
  }

  return {
    throughputData: alignToTimeline(throughputRaw),
    iopsData: alignToTimeline(iopsRaw),
    latencyData: alignToTimeline(latencyRaw)
  }
}
