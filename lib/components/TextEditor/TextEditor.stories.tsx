import { default as TextEditorComponent } from './components/TextEditorFull/TextEditorFull'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

export default {
  title: 'Components/TextEditor',
  component: TextEditorComponent,
  parameters: {
    docs: {
      description: {
        component:
          'If you are using webpack you should add "import ace-builds/webpack-resolver"'
      }
    }
  }
} as ComponentMeta<typeof TextEditorComponent>

const Template: ComponentStory<typeof TextEditorComponent> = (args) => (
  <div style={{ height: '500px', display: 'flex' }}>
    <TextEditorComponent {...args} />
  </div>
)
export const TextEditor = Template.bind({})
TextEditor.args = {
  value: JSON.stringify({ key: 'test' })
}
