import type { Meta, StoryObj } from 'storybook-solidjs'
import { default as SpanTooltipComponent } from './SpanTooltip'
import React from 'react'

const meta: Meta<typeof SpanTooltipComponent> = {
  component: SpanTooltipComponent,
  title: 'Components/SpanTooltip'
}

export default meta
type Story = StoryObj<typeof SpanTooltipComponent>

export const Default: Story = {
  args: {},
  render: (args: object) => (
    <SpanTooltipComponent {...args}>Info to show</SpanTooltipComponent>
  )
}
