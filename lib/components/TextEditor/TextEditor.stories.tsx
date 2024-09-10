import type { Meta, StoryObj } from 'storybook-solidjs'
import { default as TextEditorComponent } from './TextEditor'
import React from 'react'

const meta: Meta<typeof TextEditorComponent> = {
  component: TextEditorComponent
}

export default meta
type Story = StoryObj<typeof TextEditorComponent>

export const Default: Story = {
  args: {
    value: JSON.stringify({ key: 'test' })
  },
  render: (args: object) => (
    <div style={{ height: '500px', display: 'flex' }}>
      <TextEditorComponent {...args} />
    </div>
  )
}
