import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { MiniChart, type MiniChartDataPoint } from './MiniChart'

const meta: Meta<typeof MiniChart> = {
  title: 'v2/Charts/MiniChart',
  component: MiniChart
}

export default meta
type Story = StoryObj<typeof MiniChart>

const SYNC_ID = 'performance-trio'

const wrapperStyle: CSSProperties = {
  width: '320px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  background: 'var(--bg-primary)',
  padding: '16px'
}

const IOPS_SCALE = 1000

const THROUGHPUT: MiniChartDataPoint[] = [
  { time: '10:10', value: 120 },
  { time: '10:11', value: 180 },
  { time: '10:12', value: 90 },
  { time: '10:13', value: 240 },
  { time: '10:14', value: 360 },
  { time: '10:15', value: 300 },
  { time: '10:16', value: 420 },
  { time: '10:17', value: 380 }
]

const IOPS: MiniChartDataPoint[] = [
  { time: '10:10', value: 8000 },
  { time: '10:11', value: 12000 },
  { time: '10:12', value: 9500 },
  { time: '10:13', value: 14000 },
  { time: '10:14', value: 11000 },
  { time: '10:15', value: 16500 },
  { time: '10:16', value: 15000 },
  { time: '10:17', value: 17200 }
]

const LATENCY: MiniChartDataPoint[] = [
  { time: '10:10', value: 1.2 },
  { time: '10:11', value: 0.9 },
  { time: '10:12', value: 1.5 },
  { time: '10:13', value: 1.1 },
  { time: '10:14', value: 0.8 },
  { time: '10:15', value: 1.3 },
  { time: '10:16', value: 1.0 },
  { time: '10:17', value: 0.7 }
]

export const Single: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <MiniChart
        color='var(--cyan-500)'
        data={THROUGHPUT}
        formatValue={(value) => `${value} MB/s`}
        title='Throughput'
      />
    </div>
  )
}

export const PerformanceTrio: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <MiniChart
        color='var(--cyan-500)'
        data={THROUGHPUT}
        formatValue={(value) => `${value} MB/s`}
        syncId={SYNC_ID}
        title='Throughput'
      />
      <MiniChart
        color='var(--aqua-500)'
        data={IOPS}
        formatValue={(value) => `${(value / IOPS_SCALE).toFixed(1)}K ops`}
        syncId={SYNC_ID}
        title='IOPS'
      />
      <MiniChart
        color='var(--orange-500)'
        data={LATENCY}
        formatValue={(value) => `${value.toFixed(1)} ms`}
        syncId={SYNC_ID}
        title='Avg. Latency'
      />
    </div>
  )
}
