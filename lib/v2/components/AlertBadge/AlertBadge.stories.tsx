import type { Meta, StoryObj } from '@storybook/react'

import { SEVERITY_TYPES } from '../../utils/consts'

import { ALERT_BADGE_VARIANTS, AlertBadge } from './AlertBadge'

const meta: Meta<typeof AlertBadge> = {
  title: 'v2/AlertBadge',
  component: AlertBadge,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AlertBadge>

const allSeverities = Object.values(SEVERITY_TYPES)
const rowStyle = { display: 'flex', gap: '8px', alignItems: 'center' }

export const IconWithNumber: Story = {
  render: () => (
    <div style={rowStyle}>
      {allSeverities.map((severity) => (
        <AlertBadge
          key={severity}
          count={3}
          severity={severity}
        />
      ))}
    </div>
  )
}

export const IconWithOverflowCount: Story = {
  render: () => (
    <div style={rowStyle}>
      {allSeverities.map((severity) => (
        <AlertBadge
          key={severity}
          count={42}
          severity={severity}
        />
      ))}
    </div>
  )
}

export const IconOnly: Story = {
  render: () => (
    <div style={rowStyle}>
      {allSeverities.map((severity) => (
        <AlertBadge
          key={severity}
          severity={severity}
          variant={ALERT_BADGE_VARIANTS.ICON_ONLY}
        />
      ))}
    </div>
  )
}
