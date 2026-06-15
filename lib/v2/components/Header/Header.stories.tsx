import type { Meta, StoryObj } from '@storybook/react'

import {
  DarkModeIcon,
  NotificationsIcon,
  ThreeDotsMenuIcon
} from '../../icons'
import { HeaderMetaBanner } from '../HeaderMetaBanner'
import { IconButton } from '../IconButton'
import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'v2/Header',
  component: Header,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Header>

const frameStyle = { width: '900px', background: 'var(--gray-50-950)' }

const actions = (
  <>
    <IconButton
      ariaLabel='Notifications'
      badgeCount={12}
    >
      <NotificationsIcon />
    </IconButton>
    <IconButton ariaLabel='Toggle theme'>
      <DarkModeIcon />
    </IconButton>
    <IconButton ariaLabel='More options'>
      <ThreeDotsMenuIcon size={20} />
    </IconButton>
  </>
)

export const Default: Story = {
  render: () => (
    <div style={frameStyle}>
      <Header
        leftContent={<strong>DFW01-PROD-STR-WEK-01</strong>}
        rightContent={actions}
      />
    </div>
  )
}

export const WithCenter: Story = {
  render: () => (
    <div style={frameStyle}>
      <Header
        centerContent={<span>System alert: rebuild in progress</span>}
        leftContent={<strong>DFW01-PROD-STR-WEK-01</strong>}
        rightContent={actions}
      />
    </div>
  )
}

const metaItems = [
  { key: 'cluster', label: 'Cluster', value: 'DFW01-PROD-STR-WEK-01' },
  { key: 'tenant', label: 'Tenant', value: 'acme-production' },
  { key: 'time', label: 'Local Time', value: '14:32' }
]

export const WithMetaBanner: Story = {
  render: () => (
    <div style={frameStyle}>
      <Header
        leftContent={<HeaderMetaBanner items={metaItems} />}
        rightContent={actions}
      />
    </div>
  )
}
