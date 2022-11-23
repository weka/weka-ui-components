import  { default as LoaderComponent } from './Loader.js'

export default {
  title: "Components/Loader",
  component: LoaderComponent,
}

const Template = args => <LoaderComponent {...args} />

export const Loader = Template.bind({})

