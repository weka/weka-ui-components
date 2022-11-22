import  { default as EmptyPageMessageComponent } from "./EmptyPageMessage.js"

export default {
  title: "Components/EmptyPageMessage",
  component: EmptyPageMessageComponent,
  argTypes: {
        children: { description: 'Content of the empty page', type: { name: 'any', required: true }, },
  },
}

const Template = args => <EmptyPageMessageComponent {...args} />

export const EmptyPageMessage = Template.bind({})
EmptyPageMessage.args = {
  children: 'Some empty message'
}
