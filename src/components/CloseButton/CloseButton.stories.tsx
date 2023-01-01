import React from "react"
import  { default as CloseButtonComponent } from "./CloseButton"
import { ComponentStory, ComponentMeta } from '@storybook/react'


export default {
  title: "Components/CloseButton",
  component: CloseButtonComponent
} as ComponentMeta<typeof CloseButtonComponent>

const Template: ComponentStory<typeof CloseButtonComponent> = args => <CloseButtonComponent />

export const CloseButton = Template.bind({})
