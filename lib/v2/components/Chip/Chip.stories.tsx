import type { Meta, StoryObj } from '@storybook/react'

import { NOOP } from '../../utils/consts'

import { Chip } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'v2/Chip',
  component: Chip,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: {
    children: 'Chip Label'
  }
}

export const Closable: Story = {
  args: {
    children: 'Closable Chip',
    closable: true,
    onClose: NOOP
  }
}

export const WithCustomColors: Story = {
  args: {
    children: 'Custom Colors',
    backgroundColor: '#e8d5f5',
    textColor: '#6b21a8'
  }
}

export const WithMaxWidth: Story = {
  args: {
    children: 'This is a very long chip label that should be truncated',
    maxWidth: '150px'
  }
}

