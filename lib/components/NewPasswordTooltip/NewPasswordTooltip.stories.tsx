import {default as NewPasswordTooltipComponent} from './NewPasswordTooltip'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from 'react';

export default {
    title: "Components/NewPasswordTooltip",
    component: NewPasswordTooltipComponent
} as ComponentMeta<typeof NewPasswordTooltipComponent>

const Template: ComponentStory<typeof NewPasswordTooltipComponent> = args => (<NewPasswordTooltipComponent {...args} />)

export const NewPasswordTooltip = Template.bind({})
NewPasswordTooltip.args = {
    passValue: ''
}
