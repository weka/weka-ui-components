import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useHiddenMetrics } from '#v2/hooks'

import { BaseLineChart } from '../BaseLineChart'
import {
  type ChartDataPoint,
  SERIES_TYPES,
  type SeriesConfig
} from '../chartTypes'
import { CustomTick } from '../CustomTick'
import { CustomTooltip } from '../CustomTooltip'
import { LegendDrawer } from './LegendDrawer'

const meta: Meta<typeof LegendDrawer> = {
  title: 'v2/Charts/LegendDrawer',
  component: LegendDrawer
}

export default meta
type Story = StoryObj<typeof LegendDrawer>

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  width: '860px',
  height: '340px',
  background: 'var(--bg-primary)',
  border: '1px solid var(--border-medium)',
  padding: '8px'
}

const chartAreaStyle: CSSProperties = {
  flex: 1,
  minWidth: 0
}

const RANGE = '1h'

const NODE_SERIES = [
  { key: 'node-01', name: 'weka-node-01', color: 'var(--blue-500)', base: 620 },
  { key: 'node-02', name: 'weka-node-02', color: 'var(--aqua-500)', base: 540 },
  {
    key: 'node-03',
    name: 'weka-node-03',
    color: 'var(--fuchsia-500)',
    base: 470
  },
  {
    key: 'node-04',
    name: 'weka-node-04',
    color: 'var(--peach-500)',
    base: 380
  },
  {
    key: 'node-05',
    name: 'weka-node-05',
    color: 'var(--purple-500)',
    base: 300
  },
  { key: 'node-06', name: 'weka-node-06', color: 'var(--teal-500)', base: 220 },
  {
    key: 'node-07',
    name: 'weka-node-07',
    color: 'var(--violet-500)',
    base: 150
  }
]

const SERIES: SeriesConfig[] = NODE_SERIES.map(
  ({ key, name, color, base }) => ({
    key,
    name,
    color,
    type: SERIES_TYPES.LINE,
    value: base,
    formattedValue: `${base} MB/s`
  })
)

const BASE_TIMESTAMP_MS = 1704103200000
const MINUTE_MS = 60000
const SAMPLE_INTERVAL_MINUTES = 5
const POINT_COUNT = 12
const WAVE_AMPLITUDE = 60

const DATA: ChartDataPoint[] = Array.from(
  { length: POINT_COUNT },
  (_unused, index) => {
    const point: ChartDataPoint = {
      timestamp: BASE_TIMESTAMP_MS + index * SAMPLE_INTERVAL_MINUTES * MINUTE_MS
    }
    NODE_SERIES.forEach(({ key, base }, seriesIndex) => {
      point[key] = Math.round(
        base + WAVE_AMPLITUDE * Math.sin(index + seriesIndex)
      )
    })
    return point
  }
)

const formatThroughput = (value: number) => `${value.toLocaleString()} MB/s`

function InteractiveLegendDrawerDemo() {
  const { hiddenMetrics, toggleMetric, showAll, hideAll } = useHiddenMetrics()

  return (
    <div style={containerStyle}>
      <div style={chartAreaStyle}>
        <BaseLineChart
          data={DATA}
          hiddenMetrics={hiddenMetrics}
          series={SERIES}
          strokeWidth={2}
          tooltip={
            <CustomTooltip
              range={RANGE}
              series={SERIES}
              valueFormatter={formatThroughput}
            />
          }
          xAxis={{
            dataKey: 'timestamp',
            type: 'number',
            tick: <CustomTick range={RANGE} />
          }}
        />
      </div>
      <LegendDrawer
        hiddenMetrics={hiddenMetrics}
        onHideAll={() => hideAll(SERIES.map((seriesItem) => seriesItem.key))}
        onShowAll={showAll}
        series={SERIES}
        showValues
        toggleMetric={toggleMetric}
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveLegendDrawerDemo />
}
