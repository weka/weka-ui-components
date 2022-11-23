import { default as ToggleButtonComponent } from './ToggleButton.js'
import Utils from '../../utils.js'
import { useState } from 'react'

export default {
  title: "Components/ToggleButton",
  component: ToggleButtonComponent,
  argTypes: {
    onChange: { description: 'Trigger on click on the ToggleButton', type: { name: 'function', required: true }, },
    options: { description: 'Array of options', type: { name: 'object', required: true }, },
    value: { description: 'Control value of the toggle', type: { name: 'string', required: true }, },
  },
}

const Template = args => {
  const { options } = args
  const [value, setValue] = useState(options[0].value)
  return <ToggleButtonComponent {...args} onChange={setValue} value={value} />
}

export const ToggleButton = Template.bind({})
ToggleButton.args = {
  options: ['one', 'two', 'three'].map(Utils.formatStringOption)
}
