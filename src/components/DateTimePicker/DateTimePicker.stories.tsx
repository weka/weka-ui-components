import React from 'react'
import  { default as DateTimePickerComponent } from './DateTimePicker'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { NOP } from '../../consts'


export default {
  title: 'Components/DateTimePicker',
  component: DateTimePickerComponent
} as ComponentMeta<typeof DateTimePickerComponent>

const Template: ComponentStory<typeof DateTimePickerComponent> = args => <DateTimePickerComponent {...args} />

export const DateTimePicker = Template.bind({})
DateTimePicker.args = {
  onChange: NOP
}
