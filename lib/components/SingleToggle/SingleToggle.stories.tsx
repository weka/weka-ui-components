import type { SingleToggleProps } from './SingleToggle'
import type { Meta, StoryFn } from '@storybook/react'

import React from 'react'
import { useToggle } from '#hooks'

import { default as SingleToggleComponent } from './SingleToggle'

export default {
  title: 'Components/SingleToggle',
  component: SingleToggleComponent,
  argTypes: {
    isEnabled: {
      description: 'Is the status enabled',
      type: { name: 'boolean', required: true }
    },
    onChange: {
      description: 'Function called on status change',
      type: { name: 'function', required: true }
    },
    enabledText: {
      description: 'The text to display when enabled',
      type: { name: 'string', required: false }
    },
    disabledText: {
      description: 'The text to display when disabled',
      type: { name: 'string', required: false }
    },
    tooltip: {
      description: 'The text to display on hover',
      type: { name: 'string', required: false }
    },
    isToggleDisabled: {
      description: 'Is the toggle button disabled',
      type: { name: 'boolean', required: false }
    }
  }
} as Meta<typeof SingleToggleComponent>

function Template(args: SingleToggleProps) {
  const [enabled, toggleEnabled] = useToggle(false)
  return (
    <SingleToggleComponent
      isEnabled={enabled}
      onChange={toggleEnabled}
      {...args}
    />
  )
}

export const SingleToggle: StoryFn<typeof SingleToggleComponent> =
  Template.bind({})
SingleToggle.args = {
  enabledText: 'Enabled',
  disabledText: 'Disabled',
  tooltip: 'Click to toggle status',
  isToggleDisabled: false
}
