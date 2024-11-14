// Tooltip.stories.tsx
import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import Tooltip, { TooltipProps } from './Tooltip'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  argTypes: {
    children: {
      control: 'text',
      description: 'Content that will trigger the tooltip'
    },
    data: {
      control: 'text',
      description: 'Content of the tooltip'
    },
    clear: {
      control: 'boolean',
      description: 'Clear the tooltip styling'
    },
    extraClass: {
      control: 'text',
      description: 'Additional custom class for the tooltip'
    },
    extraPopperClass: {
      control: 'text',
      description: 'Additional custom class for the popper'
    },
    enterDelay: {
      control: 'number',
      description: 'Delay in milliseconds before the tooltip opens'
    }
  }
} as Meta

const Template: StoryFn<TooltipProps> = (args) => (
  <div style={{ marginTop: '20px', marginLeft: '10px' }}>
    <Tooltip {...args}>{args.children}</Tooltip>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  data: 'This is the tooltip content',
  children: <span>Hover over me</span>
}
