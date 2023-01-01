import  { default as InfoComponent } from './Info'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

export default {
  title: "Components/Info",
  component: InfoComponent
}as ComponentMeta<typeof InfoComponent>

const Template: ComponentStory<typeof InfoComponent> = args => <InfoComponent {...args} />

export const Info = Template.bind({})
Info.args = {
  data: 'Info to show',
}
