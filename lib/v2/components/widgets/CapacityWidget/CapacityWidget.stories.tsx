import type { Meta, StoryObj } from '@storybook/react'

import { CapacityWidget } from './CapacityWidget'

const meta: Meta<typeof CapacityWidget> = {
  title: 'v2/Widgets/CapacityWidget',
  component: CapacityWidget
}

export default meta
type Story = StoryObj<typeof CapacityWidget>

const wrapperStyle = { width: '420px', height: '220px' }

export const Default: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <CapacityWidget
        data={{ used: 62.5, free: 37.5, total: 100, unit: 'TB' }}
      />
    </div>
  )
}

export const WithDataReduction: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <CapacityWidget
        data={{
          used: 62.5,
          free: 37.5,
          total: 100,
          unit: 'TB',
          dataReduction: { ratio: '2.4:1', savings: '88 TB' }
        }}
      />
    </div>
  )
}

export const WithProvisioned: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <CapacityWidget
        showProvisioned
        data={{
          used: 62.5,
          free: 37.5,
          total: 100,
          provisioned: 240,
          unit: 'TB'
        }}
      />
    </div>
  )
}
