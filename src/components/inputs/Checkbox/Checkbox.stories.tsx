import React from 'react'
import { default as CheckboxComponent } from './Checkbox'
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  component: CheckboxComponent
} as ComponentMeta<typeof CheckboxComponent>

const Template: ComponentStory<typeof CheckboxComponent> = (args) => (
  <CheckboxComponent {...args} />
)

export const Checkbox = Template.bind({})
