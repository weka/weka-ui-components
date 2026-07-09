import type { ChartDataPoint, XAxisExtendedConfig } from '../chartTypes'

const DEFAULT_PADDING_PERCENT = 2
const FULL_PERCENT = 100

interface CalculateChartDomainResult {
  domain: (number | string)[]
  customTicks?: number[]
}

const isNumber = (value: unknown): value is number => typeof value === 'number'

/**
 * Calculates domain with padding for X-axis to avoid edge labels
 * @param data - Chart data array
 * @param xAxis - X-axis configuration
 * @param paddingPercent - Percentage of range to add as padding (default 2%)
 * @returns Object containing domain and optional custom ticks
 */
export function calculateChartDomain(
  data: ChartDataPoint[],
  xAxis?: XAxisExtendedConfig,
  paddingPercent: number = DEFAULT_PADDING_PERCENT
): CalculateChartDomainResult {
  const xAxisDomain = xAxis?.domain || ['dataMin', 'dataMax']
  const shouldAddPadding =
    xAxis?.type === 'number' && data.length > 0 && xAxis?.dataKey

  if (shouldAddPadding) {
    const dataKey = xAxis.dataKey!
    const values = data.map((point) => point[dataKey]).filter(isNumber)

    if (values.length > 0) {
      const minValue = Math.min(...values)
      const maxValue = Math.max(...values)
      const range = maxValue - minValue
      const padding = range * (paddingPercent / FULL_PERCENT)

      return {
        domain: [minValue - padding, maxValue + padding]
      }
    }
  }

  return {
    domain: xAxisDomain
  }
}
