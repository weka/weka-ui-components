import React from "react"
import CapacityBar from "./CapacityBar"
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: "Components/CapacityBar",
  component: CapacityBar
} as ComponentMeta<typeof CapacityBar>

const Template: ComponentStory<typeof CapacityBar> = args => <CapacityBar {...args} />

export const OneUsageCapacity = Template.bind({})
OneUsageCapacity.args = {
  firstUsage: 0.5
}

export const TwoUsageCapacity = Template.bind({})
TwoUsageCapacity.args = {
  firstUsage: 0.4,
  secondUsage: 0.8
}

