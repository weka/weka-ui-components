import type { Meta, StoryObj } from '@storybook/react'

import { AlertStatusChip } from './AlertStatusChip'

const meta: Meta<typeof AlertStatusChip> = {
  title: 'v2/AlertStatusChip',
  component: AlertStatusChip,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AlertStatusChip>

const rowStyle = { display: 'flex', gap: '12px' }

export const Standalone: Story = {
  render: () => (
    <div style={rowStyle}>
      <AlertStatusChip status='active' />
      <AlertStatusChip status='closed' />
    </div>
  )
}

export const Overlay: Story = {
  render: () => (
    <div style={rowStyle}>
      <AlertStatusChip
        status='active'
        variant='overlay'
      />
      <AlertStatusChip
        status='closed'
        variant='overlay'
      />
    </div>
  )
}
