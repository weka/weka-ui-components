import type { Meta, StoryObj } from '@storybook/react'

import { SystemStatus } from './SystemStatus'

const meta: Meta<typeof SystemStatus> = {
  title: 'v2/SystemStatus',
  component: SystemStatus,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SystemStatus>

const rowStyle = {
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
  color: 'var(--text-primary)'
}

export const AllStatuses: Story = {
  render: () => (
    <div style={rowStyle}>
      <SystemStatus status='Fully Protected' />
      <SystemStatus status='Partially Protected' />
      <SystemStatus status='Unprotected' />
      <SystemStatus status='Unavailable' />
    </div>
  )
}

export const WithProgress: Story = {
  render: () => (
    <div style={rowStyle}>
      <SystemStatus
        progress={75.5}
        showProgress
        status='Partially Protected'
      />
      <SystemStatus
        progress={100}
        showProgress
        status='Fully Protected'
      />
    </div>
  )
}

export const WithStatusInfo: Story = {
  render: () => (
    <div style={rowStyle}>
      <SystemStatus
        status='Fully Protected'
        statusInfo={{ label: 'Rebuilding', color: 'orange' }}
      />
      <SystemStatus
        status='Fully Protected'
        statusInfo={{ label: 'I/O Stopped', color: 'gray' }}
      />
    </div>
  )
}
