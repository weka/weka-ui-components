import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps, CSSProperties } from 'react'

import { useHiddenMetrics } from '#v2/hooks'

import { BarWithGap } from '../BarWithGap'
import {
  type ChartDataPoint,
  SERIES_TYPES,
  type SeriesConfig
} from '../chartTypes'
import { CustomLegend } from '../CustomLegend'
import { CustomTick } from '../CustomTick'
import { CustomTooltip } from '../CustomTooltip'
import { BaseComposedChart } from './BaseComposedChart'

const meta: Meta<typeof BaseComposedChart> = {
  title: 'v2/Charts/BaseComposedChart',
  component: BaseComposedChart
}

export default meta
type Story = StoryObj<typeof BaseComposedChart>

const wrapperStyle: CSSProperties = {
  width: '700px',
  height: '340px',
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--bg-primary)',
  padding: '16px'
}

const RANGE = '1h'
const TICK_MARGIN = 10

/**
 * Mirrors observe's PerformanceChart usage: ONE metric (IOPS) split into
 * read/write stacked bars + a total line, over a numeric time axis.
 */
const SERIES: SeriesConfig[] = [
  {
    key: 'read',
    name: 'Read',
    color: 'url(#gradient-blue-fade-500)',
    type: SERIES_TYPES.BAR
  },
  {
    key: 'write',
    name: 'Write',
    color: 'url(#gradient-aqua-fade-500)',
    type: SERIES_TYPES.BAR
  },
  {
    key: 'total',
    name: 'Total',
    color: 'var(--purple-500)',
    type: SERIES_TYPES.LINE
  }
]

const BASE_TIMESTAMP_MS = 1704103200000
const MINUTE_MS = 60000
const SAMPLE_INTERVAL_MINUTES = 5

const DATA: ChartDataPoint[] = [
  { read: 320, write: 140 },
  { read: 380, write: 180 },
  { read: 350, write: 165 },
  { read: 460, write: 220 },
  { read: 510, write: 260 },
  { read: 470, write: 240 },
  { read: 540, write: 300 },
  { read: 500, write: 280 },
  { read: 560, write: 320 },
  { read: 530, write: 290 }
].map((point, index) => ({
  ...point,
  total: point.read + point.write,
  timestamp: BASE_TIMESTAMP_MS + index * SAMPLE_INTERVAL_MINUTES * MINUTE_MS
}))

const formatIops = (value: number) => `${value.toLocaleString()} IOPS`

function IopsPerformanceChart() {
  const { hiddenMetrics, toggleMetric, showAll, hideAll } = useHiddenMetrics()

  return (
    <div style={wrapperStyle}>
      <BaseComposedChart
        barStackId='iops'
        data={DATA}
        hiddenMetrics={hiddenMetrics}
        series={SERIES}
        customBarShape={
          BarWithGap as ComponentProps<
            typeof BaseComposedChart
          >['customBarShape']
        }
        tooltip={
          <CustomTooltip
            range={RANGE}
            series={SERIES}
            valueFormatter={formatIops}
          />
        }
        xAxis={{
          dataKey: 'timestamp',
          type: 'number',
          tick: <CustomTick range={RANGE} />,
          tickMargin: TICK_MARGIN
        }}
        yAxis={{
          tickFormatter: (value) => Number(value).toLocaleString()
        }}
      />
      <CustomLegend
        hiddenMetrics={hiddenMetrics}
        onHideAll={() => hideAll(SERIES.map((series) => series.key))}
        onShowAll={showAll}
        series={SERIES}
        shouldHideAllBtn
        shouldShowAllBtn
        toggleMetric={toggleMetric}
      />
    </div>
  )
}

export const IopsReadWriteTotal: Story = {
  render: () => <IopsPerformanceChart />
}
