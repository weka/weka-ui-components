import type { Meta, StoryObj } from '@storybook/react'

import { DonutChart } from './DonutChart'

const meta: Meta<typeof DonutChart> = {
  title: 'v2/Charts/DonutChart',
  component: DonutChart
}

export default meta
type Story = StoryObj<typeof DonutChart>

const wrapperStyle = { width: '200px', height: '200px' }

export const Default: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <DonutChart
        segments={[
          { name: 'Used', value: 62, color: 'var(--fuchsia-400-600)' },
          { name: 'Free', value: 38, color: 'var(--gray-300-700)' }
        ]}
      />
    </div>
  )
}

export const ThreeSegments: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <DonutChart
        segments={[
          { name: 'A', value: 50, color: 'var(--purple-500-300)' },
          { name: 'B', value: 30, color: 'var(--orange-500)' },
          { name: 'C', value: 20, color: 'var(--gray-300-700)' }
        ]}
      />
    </div>
  )
}
