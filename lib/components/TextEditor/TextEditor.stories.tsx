import type { Meta, StoryObj } from 'storybook-solidjs'
import { fn } from '@storybook/test'
import { default as TextEditorComponent } from './components/TextEditorFull/TextEditorFull'
import React from 'react'

const meta: Meta<typeof TextEditorComponent> = {
  component: TextEditorComponent
}

export default meta
type Story = StoryObj<typeof TextEditorComponent>

export const Default: Story = {
  args: {
    value: JSON.stringify({ key: 'test' }),
    onClick: fn(),
    onChange: fn(),
    onValidate: fn()
  },
  render: (args: object) => (
    <div style={{ height: '500px', display: 'flex' }}>
      <TextEditorComponent {...args} />
    </div>
  )
}
