import  { default as CircularProgressComponent } from "./CircularProgress.js"

export default {
  title: "Components/CircularProgress",
  component: CircularProgressComponent,
  argTypes: {
    size: { description: 'Size of the circle', control: { type: 'number', min: 0, step: 1 }, defaultValue: 30 },
    progress: { description: 'Progress, range: 0 - 100', control: { type: 'number', min: 0,max: 100, step: 1 }, defaultValue: 0 },
    trackColor: { description: 'Color of the track', type: { name: 'string' }, defaultValue: 'var(--ironhide-key)' },
    indicatorColor: { description: 'Color of the track', type: { name: 'string' }, defaultValue: 'var(--accent-s1)' },
    indicatorWidth: { description: 'Width of the indicator', control: { type: 'number' }, defaultValue: 3 },
  },
}

const Template = args => <CircularProgressComponent {...args} />

export const CircularProgress = Template.bind({})
CircularProgress.args = {
  size: 50,
  progress: 50
}
