import type { Meta, StoryObj } from 'storybook-solidjs'
import { default as CircularProgressComponent } from './CircularProgress'
import React from 'react'

const meta: Meta<typeof CircularProgressComponent> = {
  component: CircularProgressComponent
}

export default meta
type Story = StoryObj<typeof CircularProgressComponent>

export const Default: Story = {
  args: {
    size: 100,
    progress: 50,
    indicatorWidth: 10
  },
  render: (args: object) => <CircularProgressComponent {...args} />
}
