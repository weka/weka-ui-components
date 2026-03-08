import React from 'react'
import type { Meta, StoryObj } from 'storybook-solidjs'

import { default as ErrorPageComponent } from './ErrorPage'

const meta: Meta<typeof ErrorPageComponent> = {
  component: ErrorPageComponent,
  title: 'Components/ErrorPage'
}

export default meta
type Story = StoryObj<typeof ErrorPageComponent>

export const Default: Story = {
  args: {
    children: 'Some error message'
  },
  render: (args: object) => <ErrorPageComponent {...args} />
}
