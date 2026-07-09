import { describe, expect, it } from 'vitest'

import { calculateChartDomain } from './chartDomainUtils'

const PADDED_MIN = 98
const PADDED_MAX = 202
const CUSTOM_PADDING_PERCENT = 10
const CUSTOM_PADDED_MIN = -10
const CUSTOM_PADDED_MAX = 110
const NEGATIVE_PADDED_BOUND = 104
const DECIMAL_PADDED_MIN = 0.48
const DECIMAL_PADDED_MAX = 1.52
const CLOSE_TO_DIGITS = 10

describe('chartDomainUtils', () => {
  describe('calculateChartDomain', () => {
    it('returns default domain when no xAxis config provided', () => {
      const data = [{ timestamp: 100 }, { timestamp: 200 }]

      const result = calculateChartDomain(data)

      expect(result.domain).toEqual(['dataMin', 'dataMax'])
    })

    it('returns custom domain from xAxis config when type is not number', () => {
      const data = [{ timestamp: 100 }, { timestamp: 200 }]
      const xAxis = {
        type: 'category' as const,
        domain: [0, 100] as [number, number]
      }

      const result = calculateChartDomain(data, xAxis)

      expect(result.domain).toEqual([0, 100])
    })

    it('returns default domain when data is empty', () => {
      const data: Record<string, number>[] = []
      const xAxis = {
        type: 'number' as const,
        dataKey: 'timestamp'
      }

      const result = calculateChartDomain(data, xAxis)

      expect(result.domain).toEqual(['dataMin', 'dataMax'])
    })

    it('returns default domain when dataKey is not provided', () => {
      const data = [{ timestamp: 100 }, { timestamp: 200 }]
      const xAxis = {
        type: 'number' as const
      }

      const result = calculateChartDomain(data, xAxis)

      expect(result.domain).toEqual(['dataMin', 'dataMax'])
    })

    it('calculates padded domain for number type with dataKey', () => {
      const data = [{ timestamp: 100 }, { timestamp: 200 }]
      const xAxis = {
        type: 'number' as const,
        dataKey: 'timestamp'
      }

      const result = calculateChartDomain(data, xAxis)

      expect(result.domain).toEqual([PADDED_MIN, PADDED_MAX])
    })

    it('applies custom padding percentage', () => {
      const data = [{ timestamp: 0 }, { timestamp: 100 }]
      const xAxis = {
        type: 'number' as const,
        dataKey: 'timestamp'
      }

      const result = calculateChartDomain(data, xAxis, CUSTOM_PADDING_PERCENT)

      expect(result.domain).toEqual([CUSTOM_PADDED_MIN, CUSTOM_PADDED_MAX])
    })

    it('handles single data point (zero range)', () => {
      const data = [{ timestamp: 100 }]
      const xAxis = {
        type: 'number' as const,
        dataKey: 'timestamp'
      }

      const result = calculateChartDomain(data, xAxis)

      expect(result.domain).toEqual([100, 100])
    })

    it('filters out non-numeric values', () => {
      const data = [
        { timestamp: 100 },
        { timestamp: null },
        { timestamp: undefined },
        { timestamp: 'invalid' },
        { timestamp: 200 }
      ]
      const xAxis = {
        type: 'number' as const,
        dataKey: 'timestamp'
      }

      const result = calculateChartDomain(
        data as Record<string, number | string | null | undefined>[],
        xAxis
      )

      expect(result.domain).toEqual([PADDED_MIN, PADDED_MAX])
    })

    it('returns default domain when all values are non-numeric', () => {
      const data = [
        { timestamp: null },
        { timestamp: undefined },
        { timestamp: 'invalid' }
      ]
      const xAxis = {
        type: 'number' as const,
        dataKey: 'timestamp'
      }

      const result = calculateChartDomain(
        data as Record<string, number | string | null | undefined>[],
        xAxis
      )

      expect(result.domain).toEqual(['dataMin', 'dataMax'])
    })

    it('handles negative values correctly', () => {
      const data = [{ value: -100 }, { value: 100 }]
      const xAxis = {
        type: 'number' as const,
        dataKey: 'value'
      }

      const result = calculateChartDomain(data, xAxis)

      expect(result.domain).toEqual([
        -NEGATIVE_PADDED_BOUND,
        NEGATIVE_PADDED_BOUND
      ])
    })

    it('handles decimal values correctly', () => {
      const data = [{ value: 0.5 }, { value: 1.5 }]
      const xAxis = {
        type: 'number' as const,
        dataKey: 'value'
      }

      const result = calculateChartDomain(data, xAxis)

      expect(result.domain[0]).toBeCloseTo(DECIMAL_PADDED_MIN, CLOSE_TO_DIGITS)
      expect(result.domain[1]).toBeCloseTo(DECIMAL_PADDED_MAX, CLOSE_TO_DIGITS)
    })
  })
})
