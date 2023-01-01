import React from "react"
import  { default as CircularProgressComponent } from "./CircularProgress"
import { ComponentStory, ComponentMeta } from '@storybook/react'


export default {
  title: "Components/CircularProgress",
  component: CircularProgressComponent
} as ComponentMeta<typeof CircularProgressComponent>

const Template: ComponentStory<typeof CircularProgressComponent> = args => <CircularProgressComponent {...args} />

export const CircularProgress = Template.bind({})
CircularProgress.args = {
  size: 50,
  progress: 50
}
