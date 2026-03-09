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

export const CustomHeight: Story = {
  args: {
    height: 400
  }
}

export const SmallHeight: Story = {
  args: {
    height: 150,
    message: 'No data'
  }
}

export const AutoHeight: Story = {
  args: {
    height: 'auto'
  }
}

export const InContainer: Story = {
  render: () => (
    <div style={{ height: '300px', border: '1px dashed #ccc' }}>
      <EmptyChartState
        height='100%'
        message='Full container height'
      />
    </div>
  )
}
