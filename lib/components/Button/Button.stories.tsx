import type { Meta, StoryObj } from 'storybook-solidjs'
import { ButtonProps, default as ButtonComponent } from './Button'
import React from 'react'

const meta: Meta<typeof ButtonComponent> = {
  component: ButtonComponent
}

export default meta
type Story = StoryObj<typeof ButtonComponent>

export const Default: Story = {
  args: {
    children: 'Primary'
  },
  render: (args: ButtonProps) => (
    <ButtonComponent {...args}>{args.children}</ButtonComponent>
  )
}
