import type { Meta, StoryObj } from '@storybook/react'

import { CapacityProgressBar } from './CapacityProgressBar'

const meta: Meta<typeof CapacityProgressBar> = {
  title: 'v2/CapacityProgressBar',
  component: CapacityProgressBar,
  tags: ['autodocs'],
  argTypes: {
    percentage: { control: { type: 'range', min: 0, max: 150, step: 1 } },
    height: { control: { type: 'number' } },
    borderRadius: { control: { type: 'number' } },
    showPercentageText: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof CapacityProgressBar>

export const Default: Story = {
  args: {
    percentage: 50
  }
}

export const WithPercentageText: Story = {
  args: {
    percentage: 65,
    showPercentageText: true
  }
}

export const Warning: Story = {
  args: {
    percentage: 85,
    showPercentageText: true
  }
}

export const Critical: Story = {
  args: {
    percentage: 98,
    showPercentageText: true
  }
}
