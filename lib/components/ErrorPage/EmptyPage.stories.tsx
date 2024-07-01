import {default as ErrorPageComponent} from './ErrorPage'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import React from "react"

export default {
    title: "Components/ErrorPage",
    component: ErrorPageComponent,
} as ComponentMeta<typeof ErrorPageComponent>

const Template: ComponentStory<typeof ErrorPageComponent> = args => <ErrorPageComponent {...args} />

export const ErrorPage = Template.bind({})
ErrorPage.args = {
    error: 'Some error'
}
