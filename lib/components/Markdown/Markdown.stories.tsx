import type { Meta, StoryObj } from '@storybook/react'
import { default as MarkdownComponent } from './Markdown'
import React from 'react'

const meta: Meta<typeof MarkdownComponent> = {
  component: MarkdownComponent,
  title: 'Components/Markdown'
}

export default meta
type Story = StoryObj<typeof MarkdownComponent>

export const Default: Story = {
  args: {
    children: 'Here is some **bold** text and [a link](https://example.com)'
  },
  render: (args: { children: string }) => (
    <MarkdownComponent {...args}>{args.children}</MarkdownComponent>
  )
}
