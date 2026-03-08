import React from 'react'
import type { Meta, StoryObj } from 'storybook-solidjs'

import type { EmptyPageMessageProps } from './EmptyPageMessage'
import { default as EmptyPageMessageComponent } from './EmptyPageMessage'

const meta: Meta<typeof EmptyPageMessageComponent> = {
  component: EmptyPageMessageComponent,
  title: 'Components/EmptyPageMessage'
}

export default meta
type Story = StoryObj<typeof EmptyPageMessageComponent>

export const Default: Story = {
  args: {
    children: 'Some empty message'
  },
  render: (args: EmptyPageMessageProps) => (
    <EmptyPageMessageComponent {...args}>
      {args.children}
    </EmptyPageMessageComponent>
  )
}
