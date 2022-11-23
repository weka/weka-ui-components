import CapacityBar from "./CapacityBar.js"

export default {
  title: "Components/CapacityBar",
  component: CapacityBar,
  argTypes: {
    firstUsage: { description: 'Value of the first usage, range: 0 - 1', control: { type: 'number', min: 0, max: 1, step: 0.01 } },
    secondUsage: { description: 'Value of the second usage, must be bigger then firstValue, range 0 - 1', control: { type: 'number', min: 0, max: 1, step: 0.01 } },
    firstColor: { description: 'Color of the first usage', type: { name: 'string' } },
    secondColor: { description: 'Color of the second usage', type: { name: 'string' } },
  },
}

const Template = args => <CapacityBar {...args} />

export const OneUsageCapacity = Template.bind({})
OneUsageCapacity.args = {
  firstUsage: 0.5
}

export const TwoUsageCapacity = Template.bind({})
TwoUsageCapacity.args = {
  firstUsage: 0.4,
  secondUsage: 0.8
}

