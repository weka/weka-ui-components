import  { default as NewPasswordTooltipComponent } from './NewPasswordTooltip.js'

export default {
  title: "Components/NewPasswordTooltip",
  component: NewPasswordTooltipComponent,
  argTypes: {
        passValue: { description: 'Password to check', type: { name: 'string', required: true }, }
  },
}

const Template = args =>(<NewPasswordTooltipComponent {...args} />)

export const NewPasswordTooltip = Template.bind({})
NewPasswordTooltip.args = {
  passValue: ''
}
