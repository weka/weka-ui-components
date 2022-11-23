import  { default as InfoComponent } from './Info.js'

export default {
  title: "Components/Info",
  component: InfoComponent,
  argTypes: {
        data: { description: 'Tooltip of the info', type: { name: 'string', required: true }, }
  },
}

const Template = args => <InfoComponent {...args} />

export const Info = Template.bind({})
Info.args = {
  data: 'Info to show',
}
