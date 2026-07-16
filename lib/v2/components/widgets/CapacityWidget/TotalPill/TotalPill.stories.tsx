import type { Meta, StoryObj } from '@storybook/react'

import { TotalPill } from './TotalPill'

const meta: Meta<typeof TotalPill> = {
  title: 'v2/Widgets/CapacityWidget/TotalPill',
  component: TotalPill
}

export default meta
type Story = StoryObj<typeof TotalPill>

export const TotalUsable: Story = {
  args: { label: 'Total Usable', amount: { value: '718.7', unit: 'TB' } }
}

export const TotalProvisioned: Story = {
  args: { label: 'Total Provisioned', amount: { value: '5.1', unit: 'PB' } }
}
