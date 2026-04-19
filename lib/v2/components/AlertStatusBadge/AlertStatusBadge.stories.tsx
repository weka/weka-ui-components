import type { Meta, StoryObj } from '@storybook/react'

import { SEVERITY_TYPES } from '../../utils/consts'

import { ALERT_STATUS_BADGE_SIZES, AlertStatusBadge } from './AlertStatusBadge'

const meta: Meta<typeof AlertStatusBadge> = {
  title: 'v2/AlertStatusBadge',
  component: AlertStatusBadge,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AlertStatusBadge>

const rowStyle = { display: 'flex', gap: '24px', alignItems: 'center' }

const severities = [
  SEVERITY_TYPES.CRITICAL,
  SEVERITY_TYPES.MAJOR,
  SEVERITY_TYPES.MINOR,
  SEVERITY_TYPES.WARNING,
  SEVERITY_TYPES.DEFAULT
] as const

export const AllSeverities: Story = {
  render: () => (
    <div style={rowStyle}>
      {severities.map((severity) => (
        <AlertStatusBadge
          key={severity}
          severity={severity}
        />
      ))}
    </div>
  )
}

export const WithStartTime: Story = {
  render: () => (
    <div style={rowStyle}>
      <AlertStatusBadge
        severity={SEVERITY_TYPES.CRITICAL}
        startTime='2 hours ago'
      />
      <AlertStatusBadge
        severity={SEVERITY_TYPES.MAJOR}
        startTime='5 minutes ago'
      />
    </div>
  )
}

export const SmallSize: Story = {
  render: () => (
    <div style={rowStyle}>
      {severities.map((severity) => (
        <AlertStatusBadge
          key={severity}
          severity={severity}
          size={ALERT_STATUS_BADGE_SIZES.SMALL}
        />
      ))}
    </div>
  )
}
