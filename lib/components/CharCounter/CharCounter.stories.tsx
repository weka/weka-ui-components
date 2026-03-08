import React from 'react'
import type { Meta, StoryFn } from '@storybook/react'

import { EMPTY_STRING } from '../../consts'
import { TextBox } from '../inputs'

import type { CharCounterProps } from './CharCounter'
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
  const [value, setValue] = React.useState(EMPTY_STRING)
  return (
    <div style={{ maxWidth: '300px' }}>
      <TextBox
        onChange={setValue}
        value={value}
      />
      <CharCounter
        messageLength={value.length}
        {...args}
      />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  maxChars: 50
}
