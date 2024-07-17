import type { Meta, StoryObj } from 'storybook-solidjs'
import { default as SpinnerComponent, SpinnerProps } from './Spinner'
import React from 'react'

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
