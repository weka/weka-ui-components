import { default as SwitchComponent } from './Switch'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from 'react';

export default {
  title: "Components/Switch",
  component: SwitchComponent,
}as ComponentMeta<typeof SwitchComponent>

const Template: ComponentStory<typeof SwitchComponent> = args => <SwitchComponent {...args} />

export const Switch = Template.bind({})
Switch.args = {
  onChange: (value) => { console.log(value)},
}
