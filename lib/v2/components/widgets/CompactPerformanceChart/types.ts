import type { TimeSeriesPoint } from '../../charts/chartTypes'

export type CompactPerformanceDataPoint = TimeSeriesPoint

export interface CompactPerformanceMetricData {
  data: CompactPerformanceDataPoint[]
  isLoading?: boolean
  hasValidData?: boolean
  formatValue: (value: number) => string
  label: string
  color?: string
}

export interface CompactPerformanceChartProps {
  throughput: CompactPerformanceMetricData
  iops: CompactPerformanceMetricData
  latency: CompactPerformanceMetricData
  dataTestId?: string
}

export interface TooltipState {
  active: boolean
  label: string
  dataIndex: number
  viewportX: number
  viewportY: number
}

export interface RechartsMouseState {
  activeTooltipIndex?: number
  activeLabel?: string
}

export interface UnifiedTooltipMetric {
  data: CompactPerformanceDataPoint[]
  label: string
  color: string
  formatValue: (value: number) => string
}

export interface UnifiedTooltipProps {
  dataIndex: number
  label: string
  metrics: UnifiedTooltipMetric[]
  viewportX: number
  viewportY: number
  dataTestId?: string
}
