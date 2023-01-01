import {default as LoaderComponent} from './Loader'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from 'react';

export default {
    title: "Components/Loader",
    component: LoaderComponent,
} as ComponentMeta<typeof LoaderComponent>

const Template: ComponentStory<typeof LoaderComponent> = args => <LoaderComponent />

export const Loader = Template.bind({})

