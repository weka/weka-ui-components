import type { TimeSeriesPoint } from '../chartTypes'

import { describe, expect, it } from 'vitest'

import {
  createCommonTimelineData,
  generateZeroLineData,
  interpolateValue
} from './dataUtils'

const EMPTY_SERIES: { timestamp: number; value: number }[] = []
const FIRST_POINT = { timestamp: 100, value: 10 }
const SECOND_POINT = { timestamp: 200, value: 20 }
const series = [FIRST_POINT, SECOND_POINT]

describe('interpolateValue', () => {
  it('returns 0 for an empty series', () => {
    expect(interpolateValue(EMPTY_SERIES, FIRST_POINT.timestamp)).toBe(0)
  })

  it('returns the exact value at a matching timestamp', () => {
    expect(interpolateValue(series, SECOND_POINT.timestamp)).toBe(
      SECOND_POINT.value
    )
  })

  it('linearly interpolates between the surrounding points', () => {
    const midpointTimestamp =
      (FIRST_POINT.timestamp + SECOND_POINT.timestamp) / 2
    const midpointValue = (FIRST_POINT.value + SECOND_POINT.value) / 2
    expect(interpolateValue(series, midpointTimestamp)).toBe(midpointValue)
  })

  it('clamps to the first value when the target is before the series', () => {
    const beforeSeriesTimestamp = FIRST_POINT.timestamp - 1
    expect(interpolateValue(series, beforeSeriesTimestamp)).toBe(
      FIRST_POINT.value
    )
  })

  it('clamps to the last value when the target is after the series', () => {
    const afterSeriesTimestamp = SECOND_POINT.timestamp + 1
    expect(interpolateValue(series, afterSeriesTimestamp)).toBe(
      SECOND_POINT.value
    )
  })
})

describe('generateZeroLineData', () => {
  it('produces a zero-value point for each timestamp', () => {
    const timestamps = [FIRST_POINT.timestamp, SECOND_POINT.timestamp]
    const result = generateZeroLineData(timestamps)

    expect(result.every((point) => point.value === 0)).toBe(true)
    expect(result.map((point) => point.timestamp)).toEqual(timestamps)
  })
})

describe('createCommonTimelineData', () => {
  it('passes series through unchanged when none carry a timestamp', () => {
    const throughputRaw: TimeSeriesPoint[] = [
      { time: 't1', value: 100 },
      { time: 't2', value: 150 }
    ]
    const iopsRaw: TimeSeriesPoint[] = [
      { time: 't1', value: 1000 },
      { time: 't2', value: 1500 }
    ]
    const latencyRaw: TimeSeriesPoint[] = [
      { time: 't1', value: 1 },
      { time: 't2', value: 2 }
    ]

    const result = createCommonTimelineData(throughputRaw, iopsRaw, latencyRaw)

    expect(result.throughputData).toBe(throughputRaw)
    expect(result.iopsData).toBe(iopsRaw)
    expect(result.latencyData).toBe(latencyRaw)
  })

  it('merges timestamped series onto their union of timestamps', () => {
    const throughputRaw: TimeSeriesPoint[] = [
      { time: 't1', timestamp: FIRST_POINT.timestamp, value: 10 },
      { time: 't2', timestamp: SECOND_POINT.timestamp, value: 20 }
    ]
    const iopsRaw: TimeSeriesPoint[] = [
      { time: 't1', timestamp: FIRST_POINT.timestamp, value: 1000 }
    ]
    const latencyRaw: TimeSeriesPoint[] = []

    const result = createCommonTimelineData(throughputRaw, iopsRaw, latencyRaw)

    expect(result.throughputData.map((point) => point.timestamp)).toEqual([
      FIRST_POINT.timestamp,
      SECOND_POINT.timestamp
    ])
    expect(result.iopsData.map((point) => point.value)).toEqual([
      iopsRaw[0].value,
      iopsRaw[0].value
    ])
    expect(result.latencyData.every((point) => point.value === 0)).toBe(true)
    expect(result.latencyData).toHaveLength(throughputRaw.length)
  })

  it('keeps a series that has values but no timestamps while a sibling is timestamped', () => {
    const throughputRaw: TimeSeriesPoint[] = [
      { time: 't1', timestamp: FIRST_POINT.timestamp, value: 10 },
      { time: 't2', timestamp: SECOND_POINT.timestamp, value: 20 }
    ]
    const iopsRaw: TimeSeriesPoint[] = [
      { time: 't1', value: 1000 },
      { time: 't2', value: 1500 }
    ]

    const result = createCommonTimelineData(throughputRaw, iopsRaw, [])

    expect(result.iopsData.map((point) => point.value)).toEqual(
      iopsRaw.map((point) => point.value)
    )
  })

  it('fills a metric with no raw data of its own with a zero line', () => {
    const throughputRaw: TimeSeriesPoint[] = [
      { time: 't1', timestamp: FIRST_POINT.timestamp, value: FIRST_POINT.value }
    ]
    const result = createCommonTimelineData(throughputRaw, [], [])

    expect(result.throughputData).toHaveLength(throughputRaw.length)
    expect(result.iopsData).toHaveLength(throughputRaw.length)
    expect(result.iopsData[0].value).toBe(0)
  })
})
