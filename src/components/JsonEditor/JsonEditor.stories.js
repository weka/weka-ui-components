import { default as JsonEditorComponent } from './JsonEditor.js'

export default {
  title: "Components/JsonEditor",
  component: JsonEditorComponent,
  parameters: {
    docs: {
      description: {
        component: 'If you are using webpack you add add "import ace-builds/webpack-resolver"',
      },
    }
  },
  argTypes: {
    value: { description: 'Value of the json', type: { name: 'string', required: true }, },
    readOnly: { description: 'Read only mode', type: { name: 'boolean' }, },
    onChange: { description: 'On value change', type: { name: 'function', required: true }, },
    onValidate :  { description: 'Return errors in the json', type: { name: 'function'} },
  },
}

const Template = args => (
  <div style={{ height: '500px', display: 'flex' }}>
    <JsonEditorComponent {...args} />
  </div>
)
export const JsonEditor = Template.bind({})
JsonEditor.args = {
  value: JSON.stringify({key: 'test'})
}
