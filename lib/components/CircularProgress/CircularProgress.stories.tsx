import type { Meta, StoryObj } from 'storybook-solidjs'

import React from 'react'

import { default as CircularProgressComponent } from './CircularProgress'

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
