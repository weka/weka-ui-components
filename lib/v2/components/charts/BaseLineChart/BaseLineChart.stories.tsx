import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import {
  type ChartDataPoint,
  SERIES_TYPES,
  type SeriesConfig
} from '../chartTypes'
import { CustomTooltip } from '../CustomTooltip'
import { BaseLineChart } from './BaseLineChart'

const meta: Meta<typeof BaseLineChart> = {
  title: 'v2/Charts/BaseLineChart',
  component: BaseLineChart
}

export default meta
type Story = StoryObj<typeof BaseLineChart>

const wrapperStyle: CSSProperties = {
  width: '700px',
  height: '300px',
  background: 'var(--bg-primary)',
  padding: '16px'
}

const SERIES: SeriesConfig[] = [
  {
    key: 'read',
    name: 'Read',
    color: 'var(--blue-500)',
    type: SERIES_TYPES.LINE
  },
  {
    key: 'write',
    name: 'Write',
    color: 'var(--aqua-500)',
    type: SERIES_TYPES.LINE
  },
  {
    key: 'metadata',
    name: 'Metadata',
    color: 'var(--fuchsia-500)',
    type: SERIES_TYPES.LINE
  }
]

const BASE_TIMESTAMP_MS = 1704103200000
const MINUTE_MS = 60000
const SAMPLE_INTERVAL_MINUTES = 10

const DATA: ChartDataPoint[] = [
  { read: 420, write: 180, metadata: 60 },
  { read: 480, write: 210, metadata: 75 },
  { read: 460, write: 260, metadata: 55 },
  { read: 530, write: 240, metadata: 90 },
  { read: 610, write: 305, metadata: 80 },
  { read: 570, write: 280, metadata: 70 },
  { read: 640, write: 330, metadata: 95 }
].map((point, index) => ({
  ...point,
  timestamp: BASE_TIMESTAMP_MS + index * SAMPLE_INTERVAL_MINUTES * MINUTE_MS
}))

const formatTime = (value: string | number) =>
  new Date(Number(value)).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

export const Interactive: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <BaseLineChart
        data={DATA}
        series={SERIES}
        tooltip={
          <CustomTooltip
            series={SERIES}
            valueFormatter={(value) => `${value} MB/s`}
          />
        }
        xAxis={{
          dataKey: 'timestamp',
          tickFormatter: formatTime
        }}
      />
    </div>
  )
}
