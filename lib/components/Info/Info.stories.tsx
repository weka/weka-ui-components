import React from 'react'
import type { Meta, StoryObj } from 'storybook-solidjs'

import type { InfoProps } from './Info'
import { default as InfoComponent } from './Info'

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
