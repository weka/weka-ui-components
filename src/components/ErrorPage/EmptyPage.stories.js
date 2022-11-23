import  { default as ErrorPageComponent } from "./ErrorPage.js"

export default {
  title: "Components/ErrorPage",
  component: ErrorPageComponent,
  argTypes: {
        error: { description: 'Error to show', type: { name: 'string', required: true }, },
  },
}

const Template = args => <ErrorPageComponent {...args} />

export const ErrorPage = Template.bind({})
ErrorPage.args = {
  error: 'Some error'
}
