import type { Meta, StoryObj } from '@storybook/react'

import { BarChartTick } from './BarChartTick'

const meta: Meta<typeof BarChartTick> = {
  title: 'v2/Charts/BarChartTick',
  component: BarChartTick
}

export default meta
type Story = StoryObj<typeof BarChartTick>

export const TruncatedWithTooltip: Story = {
  render: () => (
    <svg
      height={90}
      width={320}
    >
      <BarChartTick
        payload={{ value: 'bucket-1' }}
        x={90}
        y={20}
      />
      <BarChartTick
        payload={{ value: 'a-very-long-bucket-name (hover me)' }}
        x={240}
        y={20}
      />
    </svg>
  )
}
