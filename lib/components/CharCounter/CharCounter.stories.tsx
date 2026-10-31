import type { CharCounterProps } from './CharCounter'
import type { Meta, StoryFn } from '@storybook/react'

import { useState } from 'react'

import { EMPTY_STRING } from '#consts'

import { TextBox } from '../inputs'
import CharCounter from './CharCounter'

export default {
  title: 'Components/CharCounter',
  component: CharCounter,
  argTypes: {
    maxChars: {
      description: 'Maximum of characters allowed',
      type: { name: 'number', required: true }
    },
    messageLength: {
      description: 'The current length of the message',
      type: { name: 'number', required: true }
    },
    hideMaxChars: {
      description: 'Should the "max characters" be hidden',
      type: { name: 'boolean', required: false }
    },
    extraClass: {
      description: 'Additional custom class',
      type: { name: 'string', required: false }
    }
  }
} as Meta

const Template: StoryFn<CharCounterProps> = (args) => {
  const [value, setValue] = useState<string>(EMPTY_STRING)
  const { length: messageLength } = value
  return (
    <div style={{ maxWidth: '300px' }}>
      <TextBox
        onChange={(newValue) => setValue(String(newValue))}
        value={value}
      />
      <CharCounter
        {...args}
        messageLength={messageLength}
      />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  maxChars: 50
}
