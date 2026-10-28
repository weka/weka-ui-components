import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'

import { default as ErrorPageComponent } from './ErrorPage'

const meta: Meta<typeof ErrorPageComponent> = {
  component: ErrorPageComponent,
  title: 'Components/ErrorPage'
}

export default meta
type Story = StoryObj<typeof ErrorPageComponent>

export const Default: Story = {
  args: {
    error: 'Some error message'
  },
  render: (args: object) => <ErrorPageComponent {...args} />
}
