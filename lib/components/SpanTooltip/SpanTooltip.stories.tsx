import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import SpanTooltip from './SpanTooltip'
import type { SpanTooltipProps } from './SpanTooltip'

export default {
  title: 'Components/SpanTooltip',
  component: SpanTooltip,
  argTypes: {
    children: {
      control: 'text',
      description: 'Text or number to display inside the tooltip span.'
    },
    extraClasses: {
      control: 'text',
      description: 'Additional CSS classes for custom styling.'
    },
    style: {
      control: 'object',
      description: 'Inline styles for the tooltip span.'
    },
    additionalData: {
      control: 'text',
      description: 'Additional data to show in the tooltip.'
    },
    isMultiLine: {
      control: 'boolean',
      description: 'Whether the container should have multiple lines.'
    }
  }
} as Meta

const Template: StoryFn<SpanTooltipProps> = (args) => (
  <div
    style={{ width: '150px', border: '1px solid lightgray', padding: '5px' }}
  >
    <SpanTooltip {...args}>{args.children}</SpanTooltip>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  children:
    'This is a very long text that will likely be truncated when it overflows the container width.',
  style: { color: 'blue', fontSize: '16px' },
  isMultiLine: false,
  additionalData:
    'Extra data about the long text that will appear in the tooltip'
}
