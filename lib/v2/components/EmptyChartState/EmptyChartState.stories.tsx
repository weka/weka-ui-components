import type { Meta, StoryObj } from '@storybook/react'

import { EmptyChartState } from './EmptyChartState'

const meta: Meta<typeof EmptyChartState> = {
  title: 'v2/EmptyChartState',
  component: EmptyChartState,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    height: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof EmptyChartState>

export const Default: Story = {
  args: {}
}

export const CustomMessage: Story = {
  args: {
    message: 'No data available for this time range'
  }
}

export const SmallHeight: Story = {
  args: {
    height: 150,
    message: 'No data'
  }
}
