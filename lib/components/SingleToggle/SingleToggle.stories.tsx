import {
  default as SingleToggleComponent,
  SingleToggleProps
} from './SingleToggle'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

export default {
  title: 'Components/SingleToggle',
  component: SingleToggleComponent,
  argTypes: {
    isEnabled: {
      description: 'Is the status enabled',
      type: { name: 'boolean', required: false }
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
    }
  }
} as ComponentMeta<typeof SingleToggleComponent>

const Template: ComponentStory<typeof SingleToggleComponent> = (
  args: SingleToggleProps
) => {
  return <SingleToggleComponent isEnabled={true} {...args} />
}

export const SingleToggle = Template.bind({})
SingleToggle.args = {
  isEnabled: true,
  enabledText: 'Enabled',
  disabledText: 'Disabled',
  tooltip: 'Click to toggle status'
}
