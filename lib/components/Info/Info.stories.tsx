import { default as InfoComponent, InfoProps } from './Info'
import React from 'react'
import type { Meta, StoryObj } from 'storybook-solidjs'

const meta: Meta<typeof InfoComponent> = {
  title: 'Components/Info',
  component: InfoComponent
}

export default meta
type Story = StoryObj<typeof InfoComponent>

export const Default: Story = {
  args: {
    data: 'Info to show'
  },
  render: (args: InfoProps) => <InfoComponent {...args} />
}
