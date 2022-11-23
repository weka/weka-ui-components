import { default as SpanTooltipComponent } from './SpanTooltip.js'

export default {
  title: "Components/SpanTooltip",
  component: SpanTooltipComponent,
  argTypes: {
    children: { description: 'String', type: { name: 'string', required: true }, }
  },
}

const Template = args => (
  <div style={{width: '85px', display: 'flex', border: '1px solid black'}}>
    <SpanTooltipComponent {...args} />
  </div>
)

export const SpanTooltip = Template.bind({})
SpanTooltip.args = {
  children: 'Info to show',
}
