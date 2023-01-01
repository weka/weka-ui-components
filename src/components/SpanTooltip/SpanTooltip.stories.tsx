import { default as SpanTooltipComponent } from './SpanTooltip'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from 'react';

export default {
  title: "Components/SpanTooltip",
  component: SpanTooltipComponent
} as ComponentMeta<typeof SpanTooltipComponent>

const Template: ComponentStory<typeof SpanTooltipComponent> = args => (
  <div style={{width: '85px', display: 'flex', border: '1px solid black'}}>
    <SpanTooltipComponent {...args} />
  </div>
)

export const SpanTooltip = Template.bind({})
SpanTooltip.args = {
  children: 'Info to show',
}
