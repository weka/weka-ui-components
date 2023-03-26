import { default as JsonEditorComponent } from './JsonEditor'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from 'react';

export default {
  title: "Components/JsonEditor",
  component: JsonEditorComponent,
  parameters: {
    docs: {
      description: {
        component: 'If you are using webpack you should add "import ace-builds/webpack-resolver"',
      },
    }
  }
} as ComponentMeta<typeof JsonEditorComponent>

const Template: ComponentStory<typeof JsonEditorComponent> = args => (
    <div style={{height: '500px', display: 'flex'}}>
      <JsonEditorComponent {...args} />
  </div>
)
export const JsonEditor = Template.bind({})
JsonEditor.args = {
  value: JSON.stringify({key: 'test'})
}
