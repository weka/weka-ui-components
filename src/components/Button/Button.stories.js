import  { default as ButtonComponent } from "../components/Button/Button"

export default {
  title: "Components/Button",
  component: ButtonComponent,
  argTypes: {
    children: { description: 'Content of the button', type: { name: 'any', required: true }, },
    onClick: { description: 'Action on click', action: 'clicked', type: { name: 'function', required: true } },
    disable: { description: 'Is disabled', defaultValue: false, type: { name: 'boolean' }},
    extraClass: { description: 'Extra css class to attach', defaultValue: '', type: { name: 'string' } },
    isLoading: { description: 'Is Loading button', defaultValue: false, type: { name: 'boolean'} },
    empty: { description: 'Is empty button', defaultValue: false, type: { name: 'boolean'} },
    fullWidth: { description: 'Full width button', defaultValue: false, type: { name: 'boolean'}},
    small: { description: 'Small button', defaultValue: false, type: { name: 'boolean'}  }
  },
}

const Template = args => <ButtonComponent {...args} />

export const Button = Template.bind({})
Button.args = {
  children: 'Primary'
}
