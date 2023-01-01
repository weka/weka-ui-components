import React from "react"
import  { default as EmptyPageMessageComponent } from "./EmptyPageMessage"
import { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: "Components/EmptyPageMessage",
  component: EmptyPageMessageComponent,
} as ComponentMeta<typeof EmptyPageMessageComponent>

const Template: ComponentStory<typeof EmptyPageMessageComponent> = args => <EmptyPageMessageComponent {...args} />

export const EmptyPageMessage = Template.bind({})
EmptyPageMessage.args = {
  children: 'Some empty message'
}
