import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useHiddenMetrics } from '#v2/hooks'

import { BaseLineChart } from '../BaseLineChart'
import {
  type ChartDataPoint,
  SERIES_TYPES,
  type SeriesConfig
} from '../chartTypes'
import { CustomLegend } from './CustomLegend'

const meta: Meta<typeof CustomLegend> = {
  title: 'v2/Charts/CustomLegend',
  component: CustomLegend
}

export default meta
type Story = StoryObj<typeof CustomLegend>

const wrapperStyle: CSSProperties = {
  width: '700px',
  background: 'var(--bg-primary)',
  padding: '16px'
}

const chartStyle: CSSProperties = {
  height: '260px'
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
  { read: 640, write: 330, metadata: 95 }
].map((point, index) => ({
  ...point,
  timestamp: BASE_TIMESTAMP_MS + index * SAMPLE_INTERVAL_MINUTES * MINUTE_MS
}))

function InteractiveLegendDemo() {
  const { hiddenMetrics, toggleMetric, showAll, hideAll } = useHiddenMetrics()

  return (
    <div style={wrapperStyle}>
      <div style={chartStyle}>
        <BaseLineChart
          data={DATA}
          hiddenMetrics={hiddenMetrics}
          series={SERIES}
        />
      </div>
      <CustomLegend
        hiddenMetrics={hiddenMetrics}
        onHideAll={() => hideAll(SERIES.map((seriesItem) => seriesItem.key))}
        onShowAll={showAll}
        series={SERIES}
        shouldHideAllBtn
        shouldShowAllBtn
        toggleMetric={toggleMetric}
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveLegendDemo />
}
