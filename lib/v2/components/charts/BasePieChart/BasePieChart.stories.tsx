import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { chartGradientsVertical } from '../chartGradients'
import { SERIES_TYPES } from '../chartTypes'
import { BasePieChart, type GradientDefinition } from './BasePieChart'
import {
  createPieChartTooltip,
  defaultPieChartLabelRenderer,
  type PieChartPayloadItem
} from './pieChartLabelUtils'

const meta: Meta<typeof BasePieChart> = {
  title: 'v2/Charts/BasePieChart',
  component: BasePieChart
}

export default meta
type Story = StoryObj<typeof BasePieChart>

const wrapperStyle: CSSProperties = {
  width: '400px',
  height: '300px',
  background: 'var(--bg-primary)',
  padding: '16px'
}

const DATA = [
  { name: 'NFS', value: 45 },
  { name: 'SMB', value: 30 },
  { name: 'S3', value: 25 }
]

const GRADIENTS: GradientDefinition[] = [
  {
    id: 'gradient-blue-600-400-vertical',
    element: chartGradientsVertical.blue
  },
  {
    id: 'gradient-aqua-600-400-vertical',
    element: chartGradientsVertical.aqua
  },
  {
    id: 'gradient-fuchsia-600-400-vertical',
    element: chartGradientsVertical.fuchsia
  }
]

const formatPayload = (payload: PieChartPayloadItem[]) =>
  payload.map((item) => ({
    dataKey: item.name,
    name: item.name,
    value: item.value,
    color: item.payload.fill,
    formattedValue: `${item.value}%`
  }))

const PieTooltip = createPieChartTooltip({
  formatPayload,
  series: DATA.map((item, index) => ({
    key: item.name,
    name: item.name,
    color: `url(#${GRADIENTS[index].id})`,
    type: SERIES_TYPES.BAR
  }))
})

export const Default: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <BasePieChart
        data={DATA}
        gradients={GRADIENTS}
        label={defaultPieChartLabelRenderer}
        tooltip={<PieTooltip />}
      />
    </div>
  )
}
