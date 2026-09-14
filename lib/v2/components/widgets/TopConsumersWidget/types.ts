import type { TopConsumersMetric } from './topConsumersConsts'

export interface TopConsumersItem {
  name: string
  value: number
  /** Second figure shown under the bar, e.g. bytes/s next to requests/s. */
  secondaryValue?: number
}

export interface TopConsumersGradient {
  start: string
  end: string
}

export interface TopConsumersColumn {
  key: string
  title: string
  /** Small tag next to the title, e.g. "NEW". */
  badge?: string
  items: TopConsumersItem[]
  formatValue: (value: number) => string
  formatSecondaryValue?: (value: number) => string
  /** Bar fill; defaults to the palette gradient for the column's position. */
  gradient?: TopConsumersGradient
  /** 0..1 share of the total held by the listed items. */
  shareOfTotal?: number
  /** What the share is of, e.g. "tenant throughput"; the footer needs both. */
  shareLabel?: string
  emptyMessage?: string
  /** Renders a quick link in the card header that calls this on click. */
  onNavigate?: () => void
  /** Accessible name of the quick link; defaults to "Open <title>". */
  navigateLabel?: string
  isLoading?: boolean
  isError?: boolean
}

export interface TopConsumersWidgetProps {
  metric: TopConsumersMetric
  onMetricChange: (metric: TopConsumersMetric) => void
  columns: TopConsumersColumn[]
  title?: string
  /** Toggle entries; defaults to throughput, IOPS, latency. */
  metrics?: TopConsumersMetric[]
  /** Rows per card after sorting descending. Defaults to 5. */
  maxItems?: number
  dataTestId?: string
}
