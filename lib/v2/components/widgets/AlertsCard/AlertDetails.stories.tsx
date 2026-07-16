import type { Meta, StoryObj } from '@storybook/react'

import { AlertDetails } from './AlertDetails'

const meta: Meta<typeof AlertDetails> = {
  title: 'v2/Widgets/AlertDetails',
  component: AlertDetails,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AlertDetails>

const containerStyle = { width: '640px' }

export const Critical: Story = {
  render: () => (
    <div style={containerStyle}>
      <AlertDetails
        alert={{
          severity: 'critical',
          timestamp: '2026-06-23T09:14:00Z',
          type: 'DRIVE_FAILURE',
          muted: false,
          content:
            'A drive in the cluster reported elevated error rates over a sustained period and has been flagged for review.',
          action:
            'Phase out the affected drive and replace it during the next maintenance window.'
        }}
      />
    </div>
  )
}

export const CompactBanner: Story = {
  render: () => (
    <div style={containerStyle}>
      <AlertDetails
        bannerSize='small'
        alert={{
          severity: 'major',
          timestamp: '2026-06-23T09:14:00Z',
          type: 'DRIVE_FAILURE',
          muted: false,
          content:
            'A drive in the cluster reported elevated error rates over a sustained period and has been flagged for review.',
          action:
            'Phase out the affected drive and replace it during the next maintenance window.'
        }}
      />
    </div>
  )
}

export const WarningWithRelatedAlerts: Story = {
  render: () => (
    <div style={containerStyle}>
      <AlertDetails
        alert={{
          severity: 'warning',
          timestamp: '2026-06-23T08:02:00Z',
          type: 'CAPACITY_THRESHOLD',
          muted: true,
          count: 3,
          content:
            'Filesystem capacity crossed the configured warning threshold.',
          groupedAlerts: [
            {
              content: 'Filesystem fs-01 reached 85% capacity.',
              timestamp: '2026-06-23T08:02:00Z'
            },
            {
              content: 'Filesystem fs-02 reached 87% capacity.',
              timestamp: '2026-06-23T08:05:00Z'
            }
          ]
        }}
      />
    </div>
  )
}
