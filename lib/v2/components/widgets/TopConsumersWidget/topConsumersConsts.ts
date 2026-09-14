import type { SegmentedControlOption } from '../../SegmentedControl'
import type { TopConsumersGradient } from './types'

import { GRADIENT_COLORS } from '../../../styles/gradientColors'

export const TOP_CONSUMERS_METRICS = {
  THROUGHPUT: 'throughput',
  IOPS: 'iops',
  LATENCY: 'latency'
} as const

export type TopConsumersMetric =
  (typeof TOP_CONSUMERS_METRICS)[keyof typeof TOP_CONSUMERS_METRICS]

export const TOP_CONSUMERS_METRIC_NAMES: Record<TopConsumersMetric, string> = {
  [TOP_CONSUMERS_METRICS.THROUGHPUT]: 'Throughput',
  [TOP_CONSUMERS_METRICS.IOPS]: 'IOPS',
  [TOP_CONSUMERS_METRICS.LATENCY]: 'Latency'
}

/** Ordered as the toggle reads: throughput, IOPS, latency. */
export const TOP_CONSUMERS_METRIC_ORDER: TopConsumersMetric[] = [
  TOP_CONSUMERS_METRICS.THROUGHPUT,
  TOP_CONSUMERS_METRICS.IOPS,
  TOP_CONSUMERS_METRICS.LATENCY
]

export const TOP_CONSUMERS_METRIC_OPTIONS: SegmentedControlOption[] =
  TOP_CONSUMERS_METRIC_ORDER.map((metric) => ({
    value: metric,
    label: TOP_CONSUMERS_METRIC_NAMES[metric]
  }))

/**
 * Bar gradients by column position, so three side-by-side cards read as
 * three distinct series without the caller picking colours.
 */
export const TOP_CONSUMERS_DEFAULT_GRADIENTS: TopConsumersGradient[] = [
  GRADIENT_COLORS.blueWide,
  GRADIENT_COLORS.peachWide,
  GRADIENT_COLORS.purpleWide
]
