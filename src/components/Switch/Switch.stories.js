import { default as SwitchComponent } from './Switch.js'

export default {
  title: "Components/Switch",
  component: SwitchComponent,
  argTypes: {
    onChange: { description: 'Trigger on click on the switch', type: { name: 'function', required: true }, },
    oneColor: { description: 'If the switch is in one color', type: { name: 'boolean', required: false }, },
    checked: { description: 'Control value if checked', type: { name: 'boolean', required: true }, },
    disabled: { description: 'If disabled', type: { name: 'boolean' }, },
  },
}

const Template = args => <SwitchComponent {...args} />

export const Switch = Template.bind({})
Switch.args = {
  onChange: (value) => { console.log(value)},
}
