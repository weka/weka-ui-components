import type { CompactPerformanceDataPoint, UnifiedTooltipMetric } from './types'
import type { Meta, StoryObj } from '@storybook/react'

import { UnifiedTooltip } from './UnifiedTooltip'

const meta: Meta<typeof UnifiedTooltip> = {
  title: 'v2/Widgets/CompactPerformanceChart/UnifiedTooltip',
  component: UnifiedTooltip,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof UnifiedTooltip>

const TIMESTAMP = 1704067200000

const formatThroughput = (value: number) => `${value.toFixed(1)} MB/s`
const formatIops = (value: number) => `${value.toFixed(0)} ops`
const formatLatency = (value: number) => `${value.toFixed(2)} ms`

const THROUGHPUT_POINT: CompactPerformanceDataPoint = {
  time: '12:00:00',
  timestamp: TIMESTAMP,
  value: 180
}

const IOPS_POINT: CompactPerformanceDataPoint = {
  time: '12:00:00',
  timestamp: TIMESTAMP,
  value: 1800
}

const LATENCY_POINT: CompactPerformanceDataPoint = {
  time: '12:00:00',
  timestamp: TIMESTAMP,
  value: 1.1
}

const METRICS: UnifiedTooltipMetric[] = [
  {
    data: [THROUGHPUT_POINT],
    label: 'Throughput',
    color: 'var(--cyan-500)',
    formatValue: formatThroughput
  },
  {
    data: [IOPS_POINT],
    label: 'IOPS',
    color: 'var(--aqua-500)',
    formatValue: formatIops
  },
  {
    data: [LATENCY_POINT],
    label: 'Avg. Latency',
    color: 'var(--orange-500)',
    formatValue: formatLatency
  }
]

const VIEWPORT_X = 80
const VIEWPORT_Y = 80

export const Default: Story = {
  render: () => (
    <UnifiedTooltip
      dataIndex={0}
      label='12:00:00'
      metrics={METRICS}
      viewportX={VIEWPORT_X}
      viewportY={VIEWPORT_Y}
    />
  )
}

const METRICS_WITHOUT_TIMESTAMP: UnifiedTooltipMetric[] = METRICS.map(
  (metric) => ({
    ...metric,
    data: metric.data.map(({ value }) => ({ time: '12:00:00', value }))
  })
)

export const NoTimestampFallsBackToLabel: Story = {
  render: () => (
    <UnifiedTooltip
      dataIndex={0}
      label='12:00:00'
      metrics={METRICS_WITHOUT_TIMESTAMP}
      viewportX={VIEWPORT_X}
      viewportY={VIEWPORT_Y}
    />
  )
}
