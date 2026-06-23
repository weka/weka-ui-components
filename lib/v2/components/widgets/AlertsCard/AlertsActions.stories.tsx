import type { Meta, StoryObj } from '@storybook/react'

import { AlertsActions } from './AlertsActions'

const meta: Meta<typeof AlertsActions> = {
  title: 'v2/Widgets/AlertsActions',
  component: AlertsActions,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AlertsActions>

export const Default: Story = {
  args: {
    sortField: 'date',
    sortOrder: 'desc',
    showMuted: false,
    onChange: () => undefined,
    onToggleMuted: () => undefined,
    onLinkClick: () => undefined
  }
}
