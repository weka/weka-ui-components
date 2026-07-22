import type { CompactPerformanceDataPoint } from './types'
import type { Meta, StoryObj } from '@storybook/react'

import { CompactPerformanceChart } from './CompactPerformanceChart'

const meta: Meta<typeof CompactPerformanceChart> = {
  title: 'v2/Widgets/CompactPerformanceChart',
  component: CompactPerformanceChart,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof CompactPerformanceChart>

const containerStyle = {
  width: '480px',
  height: '260px'
}

const THROUGHPUT: CompactPerformanceDataPoint[] = [
  { time: '10:00', value: 120 },
  { time: '10:01', value: 150 },
  { time: '10:02', value: 180 },
  { time: '10:03', value: 140 },
  { time: '10:04', value: 200 }
]

const IOPS: CompactPerformanceDataPoint[] = [
  { time: '10:00', value: 1200 },
  { time: '10:01', value: 1500 },
  { time: '10:02', value: 1800 },
  { time: '10:03', value: 1400 },
  { time: '10:04', value: 2000 }
]

const LATENCY: CompactPerformanceDataPoint[] = [
  { time: '10:00', value: 1.2 },
  { time: '10:01', value: 1.4 },
  { time: '10:02', value: 1.1 },
  { time: '10:03', value: 1.6 },
  { time: '10:04', value: 1.3 }
]

const formatThroughput = (value: number) => `${value.toFixed(1)} MB/s`
const formatIops = (value: number) => `${value.toFixed(0)} ops`
const formatLatency = (value: number) => `${value.toFixed(2)} ms`

export const Default: Story = {
  render: () => (
    <div style={containerStyle}>
      <CompactPerformanceChart
        iops={{
          data: IOPS,
          formatValue: formatIops,
          label: 'IOPS'
        }}
        latency={{
          data: LATENCY,
          formatValue: formatLatency,
          label: 'Avg. Latency'
        }}
        throughput={{
          data: THROUGHPUT,
          formatValue: formatThroughput,
          label: 'Throughput'
        }}
      />
    </div>
  )
}

export const Loading: Story = {
  render: () => (
    <div style={containerStyle}>
      <CompactPerformanceChart
        iops={{
          data: [],
          formatValue: formatIops,
          isLoading: true,
          label: 'IOPS'
        }}
        latency={{
          data: [],
          formatValue: formatLatency,
          isLoading: true,
          label: 'Avg. Latency'
        }}
        throughput={{
          data: [],
          formatValue: formatThroughput,
          isLoading: true,
          label: 'Throughput'
        }}
      />
    </div>
  )
}
