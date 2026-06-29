import type { Meta, StoryObj } from '@storybook/react'

import {
  DarkModeIcon,
  NotificationsIcon,
  ThreeDotsMenuIcon
} from '../../icons'
import { IconButton } from './IconButton'

const meta: Meta<typeof IconButton> = {
  title: 'v2/IconButton',
  component: IconButton,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof IconButton>

const rowStyle = { display: 'flex', gap: '12px', alignItems: 'center' }

export const HeaderButtons: Story = {
  render: () => (
    <div style={rowStyle}>
      <IconButton
        ariaLabel='Notifications'
        badgeCount={7}
      >
        <NotificationsIcon />
      </IconButton>
      <IconButton
        ariaLabel='Notifications overflow'
        badgeCount={150}
      >
        <NotificationsIcon />
      </IconButton>
      <IconButton ariaLabel='Toggle theme'>
        <DarkModeIcon />
      </IconButton>
      <IconButton ariaLabel='More options'>
        <ThreeDotsMenuIcon size={20} />
      </IconButton>
      <IconButton
        ariaLabel='Disabled'
        disabled
      >
        <DarkModeIcon />
      </IconButton>
    </div>
  )
}

export const Small: Story = {
  render: () => (
    <div style={rowStyle}>
      <IconButton
        ariaLabel='Row actions'
        small
      >
        <ThreeDotsMenuIcon size={14} />
      </IconButton>
      <IconButton
        ariaLabel='Toggle theme'
        small
      >
        <DarkModeIcon />
      </IconButton>
    </div>
  )
}
