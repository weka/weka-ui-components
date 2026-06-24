import type { Meta, StoryObj } from '@storybook/react'

import { PARITY_STATUSES, type ParityStatus } from '#v2/utils/consts'

import { BackUpServerIcon } from './BackUpServerIcon'
import { BackUpServersIcon } from './BackUpServersIcon'

const meta: Meta = {
  title: 'v2/Icons/BackUpServers'
}

export default meta
type Story = StoryObj

const STATUSES: ParityStatus[] = [
  PARITY_STATUSES.HEALTHY,
  PARITY_STATUSES.WARNING,
  PARITY_STATUSES.ERROR,
  PARITY_STATUSES.CRITICAL
]

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '24px'
}
const rowStyle = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: '24px'
}
const itemStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px'
}

export const Statuses: Story = {
  render: () => (
    <div style={sectionStyle}>
      <div style={rowStyle}>
        {STATUSES.map((status) => (
          <div
            key={status}
            style={itemStyle}
          >
            <BackUpServerIcon status={status} />
            <span>{status}</span>
          </div>
        ))}
      </div>
      <div style={rowStyle}>
        {STATUSES.map((status) => (
          <div
            key={status}
            style={itemStyle}
          >
            <BackUpServersIcon status={status} />
            <span>{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
