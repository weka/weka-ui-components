import type { Meta, StoryObj } from '@storybook/react'

import { ProvisionedCapacityWidget } from './ProvisionedCapacityWidget'

const meta: Meta<typeof ProvisionedCapacityWidget> = {
  title: 'v2/Widgets/ProvisionedCapacityWidget',
  component: ProvisionedCapacityWidget
}

export default meta
type Story = StoryObj<typeof ProvisionedCapacityWidget>

const wrapperStyle = { width: '220px', height: '240px' }

export const Default: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <ProvisionedCapacityWidget
        data={{ used: 72, free: 168, total: 240, usedPercentage: 30, unit: 'TB' }}
      />
    </div>
  )
}

export const Full: Story = {
  render: () => (
    <div style={wrapperStyle}>
      <ProvisionedCapacityWidget
        data={{ used: 240, free: 0, total: 240, usedPercentage: 100, unit: 'TB' }}
      />
    </div>
  )
}
