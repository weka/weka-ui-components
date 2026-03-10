import React from 'react'
import type { Meta, StoryObj } from 'storybook-solidjs'

import type { ButtonProps } from './Button'
import { default as ButtonComponent } from './Button'

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
