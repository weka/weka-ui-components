import type { Meta, StoryObj } from '@storybook/react'

import { AlertsCard } from './AlertsCard'
import { type AlertItem } from './alertsCardUtils'

const meta: Meta<typeof AlertsCard> = {
  title: 'v2/Widgets/AlertsCard',
  component: AlertsCard,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AlertsCard>

const containerStyle = {
  width: '360px',
  height: '300px'
}

const sampleAlerts: AlertItem[] = [
  {
    id: 1,
    severity: 'critical',
    title: 'Drive sdb failed on backend-3',
    content: 'Drive sdb is no longer responding and was marked failed.',
    timestamp: '2026-06-23T09:30:00Z',
    type: 'DRIVE_FAILED'
  },
  {
    id: 2,
    severity: 'major',
    title: 'Filesystem fs-root above 90% capacity',
    content: 'Filesystem fs-root is at 92% of its provisioned capacity.',
    timestamp: '2026-06-23T07:15:00Z',
    type: 'FS_CAPACITY'
  },
  {
    id: 3,
    severity: 'major',
    title: 'Filesystem fs-logs above 90% capacity',
    content: 'Filesystem fs-logs is at 94% of its provisioned capacity.',
    timestamp: '2026-06-22T22:05:00Z',
    type: 'FS_CAPACITY'
  },
  {
    id: 4,
    severity: 'minor',
    title: 'Backend reboot detected on backend-1',
    content: 'backend-1 rebooted and rejoined the cluster.',
    timestamp: '2026-06-22T18:00:00Z',
    type: 'NODE_REBOOT',
    muted: true
  },
  {
    id: 5,
    severity: 'warning',
    title: 'NTP drift exceeds threshold',
    content: 'Time drift of 1.4s detected across two backends.',
    timestamp: '2026-05-25T11:35:00Z',
    type: 'NTP_DRIFT'
  },
  {
    id: 6,
    severity: 'info',
    title: 'Snapshot policy nightly completed',
    content: 'Nightly snapshot policy completed for 12 filesystems.',
    timestamp: '2026-05-20T02:00:00Z',
    type: 'custom'
  }
]

export const Default: Story = {
  render: () => (
    <div style={containerStyle}>
      <AlertsCard
        alerts={sampleAlerts}
        showMuted
      />
    </div>
  )
}

export const WithoutTabs: Story = {
  render: () => (
    <div style={containerStyle}>
      <AlertsCard
        alerts={sampleAlerts}
        showMuted
        showTabs={false}
        sortField='severity'
      />
    </div>
  )
}
