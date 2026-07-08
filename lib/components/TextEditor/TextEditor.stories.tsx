import type { Meta, StoryObj } from 'storybook-solidjs'

import React from 'react'

import { default as TextEditorComponent } from './TextEditor'

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

const WITH_SEARCH_LINES = 50
const WITH_SEARCH_VALUE_VARIANTS = 5

export const WithSearch: Story = {
  args: {
    allowSearch: true,
    value: JSON.stringify(
      Object.fromEntries(
        Array.from({ length: WITH_SEARCH_LINES }, (_, i) => [
          `key_${i}`,
          `value ${i % WITH_SEARCH_VALUE_VARIANTS}`
        ])
      ),
      null,
      2
    )
  },
  render: Default.render
}
