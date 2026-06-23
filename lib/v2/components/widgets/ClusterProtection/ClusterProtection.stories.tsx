import type { Meta, StoryObj } from '@storybook/react'

import { ClusterProtection } from './ClusterProtection'

const meta: Meta<typeof ClusterProtection> = {
  title: 'v2/Widgets/ClusterProtection',
  component: ClusterProtection,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ClusterProtection>

const containerStyle = {
  width: '320px',
  height: '280px'
}

export const FullyProtected: Story = {
  render: () => (
    <div style={containerStyle}>
      <ClusterProtection
        stripeDataDrives={6}
        stripeProtectionDrives={2}
        systemStatus='OK'
        upFor='12d 5h'
        virtualSpares='3'
      />
    </div>
  )
}

export const Rebuilding: Story = {
  render: () => (
    <div style={containerStyle}>
      <ClusterProtection
        protectionState={[{ numFailures: 0, percent: 40 }]}
        stripeDataDrives={6}
        stripeProtectionDrives={2}
        systemRebuildProgress={42.5}
        systemStatus='REBUILDING'
        upFor='12d 5h'
        virtualSpares='3'
      />
    </div>
  )
}
