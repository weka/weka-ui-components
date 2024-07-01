import React from 'react'
import { default as TextAreaComponent } from './TextArea'
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default { component: TextAreaComponent } as ComponentMeta<
  typeof TextAreaComponent
>

const Template: ComponentStory<typeof TextAreaComponent> = (args) => (
  <TextAreaComponent {...args} />
)

export const TextArea = Template.bind({})
