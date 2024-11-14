import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import CursorTooltip, { CursorTooltipProps } from './CursorTooltip'

export default {
  title: 'Components/CursorTooltip',
  component: CursorTooltip,
  argTypes: {
    children: {
      control: 'text',
      description: 'Content that will trigger the tooltip'
    },
    data: { control: 'text', description: 'Content of the tooltip' },
    clear: { control: 'boolean', description: 'Clear the tooltip styling' },
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

const Template: StoryFn<CursorTooltipProps> = (args) => (
  <CursorTooltip {...args}>
    <div
      style={{
        marginTop: '20px',
        marginLeft: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        width: '90%',
        height: '200px',
        border: '1px solid red'
      }}
    >
      Hover over me
    </div>
  </CursorTooltip>
)

export const Default = Template.bind({})
Default.args = {
  data: 'This CursorTooltip will open after 1 second of hovering.'
}
