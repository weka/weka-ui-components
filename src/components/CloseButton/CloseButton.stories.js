import  { default as CloseButtonComponent } from "./CloseButton.js"

export default {
  title: "Components/CloseButton",
  component: CloseButtonComponent,
  argTypes: {},
}

const Template = args => <CloseButtonComponent {...args} />

export const CloseButton = Template.bind({})
CloseButton.args = {
}
