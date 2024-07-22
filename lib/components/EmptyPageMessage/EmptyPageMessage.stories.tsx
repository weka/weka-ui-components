import type { Meta, StoryObj } from 'storybook-solidjs'
import { default as EmptyPageMessageComponent, EmptyPageMessageProps } from './EmptyPageMessage'
import React from 'react'

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
