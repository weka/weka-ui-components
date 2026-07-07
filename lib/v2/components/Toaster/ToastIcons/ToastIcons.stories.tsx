import type { Meta, StoryObj } from '@storybook/react'

import {
  ErrorIcon,
  InfoIcon,
  LoadingIcon,
  SuccessIcon,
  WarningIcon
} from './ToastIcons'

const meta: Meta<typeof SuccessIcon> = {
  title: 'v2/Icons/ToastIcons',
  component: SuccessIcon,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SuccessIcon>

const rowStyle = { display: 'flex', gap: '16px', alignItems: 'center' }

export const AllIcons: Story = {
  render: () => (
    <div style={rowStyle}>
      <SuccessIcon />
      <ErrorIcon />
      <WarningIcon />
      <InfoIcon />
      <LoadingIcon />
    </div>
  )
}
