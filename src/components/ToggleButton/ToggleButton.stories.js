import { default as ToggleButtonComponent } from './ToggleButton.js'
import Utils from '../../utils.js'

export default {
  title: "Components/ToggleButton",
  component: ToggleButtonComponent,
  argTypes: {
    onChange: { description: 'Trigger on click on the ToggleButton', type: { name: 'function', required: true }, },
    options: { description: 'Array of options', type: { name: 'object', required: true }, },
    value: { description: 'Control value of the toggle', type: { name: 'string', required: true }, },
  },
}

const Template = args => <ToggleButtonComponent {...args} />

export const ToggleButton = Template.bind({})
ToggleButton.args = {
  onChange: (value) => { console.log(value)},
  options: ['one', 'two', 'three'].map(Utils.formatOption)
}
