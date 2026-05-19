import type { SpinnerProps } from './Spinner'
import type { Meta, StoryObj } from 'storybook-solidjs'

import React from 'react'

import { default as SpinnerComponent } from './Spinner'

const meta: Meta<typeof SpinnerComponent> = {
  component: SpinnerComponent,
  title: 'Components/Spinner'
}

export default meta
type Story = StoryObj<typeof SpinnerComponent>

export const Default: Story = {
  args: {},
  render: (args: SpinnerProps) => <SpinnerComponent {...args} />
}
