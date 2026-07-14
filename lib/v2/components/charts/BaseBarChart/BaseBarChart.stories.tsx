import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { Bar, Cell } from 'recharts'

import { EMPTY_STRING } from '#consts'

import { BarChartTick } from '../BarChartTick'
import { chartGradientsVertical } from '../chartGradients'
import { BAR_CHART_ORIENTATIONS, type ChartDataPoint } from '../chartTypes'
import { BaseBarChart } from './BaseBarChart'

const meta: Meta<typeof BaseBarChart> = {
  title: 'v2/Charts/BaseBarChart',
  component: BaseBarChart
}

export default meta
type Story = StoryObj<typeof BaseBarChart>

const wrapperStyle: CSSProperties = {
  width: '700px',
  height: '300px',
  background: 'var(--bg-primary)',
  padding: '16px'
}

const DATA: ChartDataPoint[] = [
  { name: 'prod-cluster-01', alerts: 14 },
  { name: 'prod-cluster-02', alerts: 9 },
  { name: 'staging-cluster', alerts: 6 },
  { name: 'dr-cluster', alerts: 4 },
  { name: 'dev-cluster', alerts: 2 }
]

export const Default: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <BaseBarChart
        data={DATA}
        dataKey='alerts'
      />
    </div>
  )
}

/**
 * Horizontal orientation: the category axis moves to Y and the value axis to X.
 */
export const Horizontal: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <BaseBarChart
        data={DATA}
        dataKey='alerts'
        orientation={BAR_CHART_ORIENTATIONS.HORIZONTAL}
      />
    </div>
  )
}

/**
 * Rotated (-45°) x-axis tick labels via `BarChartTick`, with `angledTicks`
 * reserving the extra bottom margin so long labels aren't clipped.
 */
export const AngledTicks: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <BaseBarChart
        angledTicks
        data={DATA}
        dataKey='alerts'
        xAxis={{
          tick: (
            <BarChartTick
              payload={{ value: EMPTY_STRING }}
              x={0}
              y={0}
            />
          )
        }}
      />
    </div>
  )
}

/**
 * Mirrors observe's CPU-utilization chart: two bars per category (P50/P99
 * percentiles per process type), each category cycling its own color pair.
 */
const CPU_DATA: ChartDataPoint[] = [
  { name: 'Compute', p50: 42, p99: 78 },
  { name: 'Frontend', p50: 31, p99: 64 },
  { name: 'Drive', p50: 55, p99: 91 }
]

const P50_FILLS = [
  'url(#gradient-blue-600-400-vertical)',
  'url(#gradient-aqua-600-400-vertical)',
  'url(#gradient-fuchsia-600-400-vertical)'
]

const P99_FILLS = [
  'url(#gradient-blue-300-100-vertical)',
  'url(#gradient-aqua-300-100-vertical)',
  'url(#gradient-fuchsia-300-100-vertical)'
]

const GROUP_BAR_SIZE = 30
const GROUP_BAR_GAP = 10
const GROUP_ANIMATION_MS = 200

export const GroupedBars: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <BaseBarChart
        barGap={GROUP_BAR_GAP}
        data={CPU_DATA}
        dataKey='p50'
        renderCustomBars={(data) => [
          <Bar
            key='p50'
            animationDuration={GROUP_ANIMATION_MS}
            barSize={GROUP_BAR_SIZE}
            dataKey='p50'
            name='P50'
          >
            {data.map((entry, i) => (
              <Cell
                key={`p50-${entry.name}`}
                fill={P50_FILLS[i % P50_FILLS.length]}
              />
            ))}
          </Bar>,
          <Bar
            key='p99'
            animationDuration={GROUP_ANIMATION_MS}
            barSize={GROUP_BAR_SIZE}
            dataKey='p99'
            name='P99'
          >
            {data.map((entry, i) => (
              <Cell
                key={`p99-${entry.name}`}
                fill={P99_FILLS[i % P99_FILLS.length]}
              />
            ))}
          </Bar>
        ]}
      >
        <defs>
          {chartGradientsVertical.lightBlue}
          {chartGradientsVertical.lightAqua}
          {chartGradientsVertical.lightFuchsia}
        </defs>
      </BaseBarChart>
    </div>
  )
}
